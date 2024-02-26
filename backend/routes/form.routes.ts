import auth from '../middleware/auth'
import dotenv from 'dotenv';
import express, { Request, Response } from 'express'
import { body } from 'express-validator';
import validate from '../middleware/validate';
import Form from '../models/Form';
import Question from '../models/Question';

// auth is middleware which validates the token and passon the information of user by decrypting token


dotenv.config();
var router = express.Router();


router.get('/', auth,
  async function (_: Request, res: Response) {
    try {
      const forms = await Form.find({ author_id: res.user._id }).select({ questions: 0 })
      return res.status(200).json({ msg: "Created", forms })
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  });

router.get('/:form_id',
  async function (req: Request, res: Response) {
    try {
      const { form_id } = req.params
      if (!form_id) {
        return res.status(400).json({ msg: "" })
      }

      const form = await Form.findById(form_id).select({ questions: 0 })
      if (!form)
        return res.status(404).json({ msg: "" })
      return res.status(200).json({ msg: "Created", form: form.toObject() })
      
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  });

router.get('/q/:form_id', auth,
  async function (req: Request, res: Response) {
    try {
      const { form_id } = req.params
      if (!form_id) {
        return res.status(400).json({ msg: "" })
      }

      const form = await Form.findById(form_id).select({ questions: 1 })
      if (!form)
        return res.status(404).json({ msg: "" });

      const { questions } = form.toObject()
      const getQuestionPromiseArr = questions.map(async (qId) => {
        try {
          const que = await Question.findById(qId)
          if (que) {
            return que.toJSON()
          } else {
            return null
          }
        } catch (err) {
          return undefined
        }
      })
      const questionsList = await Promise.all(getQuestionPromiseArr)
      // const questions = await Question.find({ form_id }).sort({ seq_number: 1 })
      return res.status(200).json({ msg: "Created", questions: questionsList })
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  });

router.post('/',
  auth,
  body('title').exists().isString().isLength({ max: 50, min: 1 }).trim(),
  body('description').optional().isString().isLength({ max: 300 }).trim(),
  validate,
  async function (req: Request, res: Response) {
    try {
      const { title, description }: { title: string, description?: string } = req.body

      const form = await Form.create({
        author_id: res.user._id,
        title,
        description: (description) ? description : ""
      })


      return res.status(201).json({ msg: "Created", form: form.toObject() })
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  });


export default router