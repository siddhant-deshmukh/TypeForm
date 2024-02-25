import auth from '../middleware/auth'
import dotenv from 'dotenv';
import express, { Request, Response } from 'express'
import { body } from 'express-validator';
import validate from '../middleware/validate';
import Form from '../models/Form';

// auth is middleware which validates the token and passon the information of user by decrypting token


dotenv.config();
var router = express.Router();


router.get('/', auth,
  async function (_: Request, res: Response) {
    try {
      const forms = await Form.find({ author_id: res.user._id })
      return res.status(200).json({ msg: "Created", forms })
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