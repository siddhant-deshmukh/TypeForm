import dotenv from 'dotenv';
import { body } from 'express-validator';
import express, { Request, Response } from 'express'

import Form from '../models/Form';
import auth from '../middleware/auth'
import Question from '../models/Question';
import validate from '../middleware/validate';

// auth is middleware which validates the token and passon the information of user by decrypting token


dotenv.config();
var router = express.Router();


router.get('/:form_id', auth,
  async function (req: Request, res: Response) {
    try {
      const { form_id } = req.params
      if (!form_id) {
        return res.status(400)
      }

      const questions = await Question.find({ form_id }).sort({ seq_number: 1 })
      return res.status(200).json({ msg: "Created", questions })
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  });

router.post('/:form_id',
  auth,
  body('title').exists().isString().isLength({ max: 50, min: 1 }).trim(),
  body('description').optional().isString().isLength({ max: 300 }).trim(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const { form_id } = req.params
      if (!form_id) {
        return res.status(400)
      }
      const { title, description }: { title: string, description?: string } = req.body

      const check_form_author = await CheckFormAuthor(form_id, res.user._id.toString())
      if (check_form_author === false) {
        return res.status(401)
      } else if (check_form_author === undefined){
        return res.status(500)
      }

      const question = await Question.create({
        author_id: res.user._id,
        title,
        form_id,
        description: (description) ? description : "",
      })


      return res.status(201).json({ msg: "Created", question: question.toObject() })
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