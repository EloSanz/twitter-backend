import { Router } from 'express'
import { withAuth } from '@utils'

import { userRouter } from '@domains/user'
import { postRouter } from '@domains/post'
import { authRouter } from '@domains/auth'
import { healthRouter } from '@domains/health'
import { followerRouter } from '@domains/follower/controller/follower.controller'
import { reactionRouter } from '@domains/reaction/controller/reaction.controller'
import { commentRouter } from '@domains/comment/controller/comment.controller'
import { messageRouter } from '@domains/messages/controller/message.controller'

export const router = Router()

router.use('/health', healthRouter)
router.use('/auth', authRouter)
router.use('/user', withAuth, userRouter)
router.use('/post', withAuth, postRouter)
router.use('/follower', withAuth, followerRouter)
router.use('/reaction', withAuth, reactionRouter)
router.use('/comment', withAuth, commentRouter)
router.use('/message', withAuth, messageRouter)
