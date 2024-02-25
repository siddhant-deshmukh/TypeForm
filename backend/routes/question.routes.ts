import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import express, { Request, Response } from 'express'

import Form from '../models/Form';
import auth from '../middleware/auth'
import validate from '../middleware/validate';
import Question, { IQuestionCreate } from '../models/Question';

// auth is middleware which validates the token and passon the information of user by decrypting token


dotenv.config();
var router = express.Router();

// Unprotected route anyone can see the question
router.get('/:form_id/:que_id',
  async function (req: Request, res: Response) {
    try {
      const { form_id, que_id } = req.params
      if (!form_id) {
        return res.status(400).json({ msg: "" })
      }

      const question = await Question.findOne({ form_id, _id: que_id })
      if (!question)
        return res.status(404).json({ msg: "Invalid form_id or question_id" })

      return res.status(200).json({ msg: "Created", question })
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  })

// route protected
router.post('/:form_id',
  auth,
  body('title').exists().isString().isLength({ max: 50, min: 1 }).trim(),
  body('description').optional().isString().isLength({ max: 300 }).trim(),
  body('type').exists().isIn(['short', 'long', 'mcq']),
  body('maxLength').optional().isInt(),
  body('options').optional().isArray({ max: 50 }),
  body('options.*').isString().isLength({ min: 1, max: 50 }),
  validate,
  async function (req: Request, res: Response) {
    try {
      const { form_id } = req.params
      if (!form_id) {
        return res.status(400).json({ msg: "" })
      }
      const { title, description, type, maxLength, options }: IQuestionCreate = req.body
      if (
        ((type === "long" || type === "short") && (maxLength === undefined || maxLength < 0))
        ||
        (type === "mcq" && (options === undefined || options?.length < 1))
      )
        return res.status(404).json({ msg: "invalid question type" });

      // console.log("Checking author")
      const check_form_author = await CheckFormAuthor(form_id, res.user._id.toString())
      if (check_form_author === false) {
        return res.status(401).json({ msg: "" })
      } else if (check_form_author === undefined) {
        return res.status(500).json({ msg: "" })
      }
      // console.log("Author checked")
      const session = await mongoose.startSession()
      session.startTransaction()
      try {
        const question = await Question.create({
          author_id: res.user._id,
          title,
          form_id,
          description: (description) ? description : "",
          type,
          maxLength,
          options
        })
        // console.log(question.toJSON())
        await Form.findByIdAndUpdate(form_id, {
          $push: { questions: question._id }
        })
        // console.log("Form updated")
        await session.commitTransaction()
        await session.endSession()

        return res.status(201).json({ question: question.toObject() })
      } catch (err) {
        await session.abortTransaction()
        await session.endSession()
        return res.status(500).json({ msg: "Internal server error", err })
      }

    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  });

export async function CheckFormAuthor(form_id: string, author_id: string) {
  try {
    const exist = await Form.exists({ _id: form_id, author_id })
    if (exist)
      return true;
    else
      return false;
  } catch (err) {
    console.error("in CheckFormAUthor", err)
    return undefined
  }
}

export default router