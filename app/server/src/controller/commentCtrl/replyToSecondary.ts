import { NextFunction, Request, Response } from "express";
import { asyncHandler, ErrorResponse } from "../../lib/utils";
import Secondary from "../../models/Comment/Secondary";

// @desc      Reply to Secondary Comment
// @route     GET /api/v1/comments/reply/secondary/:commentId
// @access    Auth,Public,Admin
// action => replyToSecondary => create Tertiary Comment as response

const replyToSecondary = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const secondaryComment = await Secondary.findById(
      req.params.commentId
    ).lean();
    if (!secondaryComment) {
      return next(ErrorResponse(400, "Resource not found"));
    }
    const reply = (
      await Secondary.create({
        // @ts-ignore
        user: req.user._id,
        text: req.body.text,
        secondaryUser: secondaryComment.user,
        secondary: secondaryComment._id,
        primary: secondaryComment.primary,
      })
    ).populate([
      { path: "meta" },
      {
        path: "user",
        select: "email username",
      },
      {
        path: "secondaryUser",
        select: "username email",
      },
    ]);
    res.json({
      status: "ok",
      reply,
    });
  }
);
export default replyToSecondary;
