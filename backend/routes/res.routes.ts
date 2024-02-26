import dotenv from 'dotenv';
import express, { Request, Response } from 'express'

import FormResponse, { IQuesRes } from '../models/Response';
import auth from '../middleware/auth'
import Form from '../models/Form';
import { CheckFormAuthor } from './question.routes';

dotenv.config();
var router = express.Router();

router.get('/:form_id',
  auth,
  async function (req: Request, res: Response) {
    try {
      const { form_id } = req.params
      if (!form_id) {
        return res.status(400).json({ msg: "" })
      }

      const check_form_author = await CheckFormAuthor(form_id, res.user._id.toString())
      if (check_form_author === false) {
        return res.status(401).json({ msg: "" })
      } else if (check_form_author === undefined) {
        return res.status(500).json({ msg: "" })
      }

      const form_responses = await FormResponse.find({ form_id })

      return res.status(200).json({ form_responses })
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  })

router.post('/:form_id',
  async function (req: Request, res: Response) {
    try {
      const { form_id } = req.params
      const { form_response }: { form_response?: IQuesRes[] } = req.body

      if (!form_id || !form_response || !Array.isArray(form_response) || form_response.length > 50) {
        return res.status(400).json({ msg: "" })
      }

      const formExist = await Form.exists({ _id: form_id })
      if (!formExist)
        return res.status(404).json({ msg: "" });

      await FormResponse.create({
        form_id,
        formresponse: form_response,
        time: Date.now()
      })

      return res.status(201).json({ msg: "Created!" })
    } catch (err) {
      return res.status(500).json({ msg: 'Some internal error occured', err })
    }
  });

export default router