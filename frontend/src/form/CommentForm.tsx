import { useForm, useWatch } from "react-hook-form";
import Button from "../ui/Button";
import { useState } from "react";
import type { commentData } from "../types/commenttype";
import { useAuth } from "../context/ApiContext";
import { showError } from "../utils/toast";
import { commentSchema } from "../validations/commentSchema";
import { postComment } from "../api/comment";
import { getErrorMessage } from "../utils/getErrorMessage";

type Props = {
  postId : string
}

export default function CommentForm({ postId } : Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const { user, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<commentData>();

  const onComment = async (data: commentData) => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      if (!user || !isAuthenticated) {
        reset()
        return showError("Please Login to leave a comment");
      }

      const commentValue = { ...data, postId}

      commentSchema.parse(commentValue)
      await postComment(commentValue)
      
      reset()
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const message = useWatch({
    control,
    name: "message",
    defaultValue: "",
  });

  return (
    <form onSubmit={handleSubmit(onComment)}>
      <textarea
        placeholder="Add a comment..."
        className="w-full bg-gray-900/40 border border-(--border) rounded-md px-3 py-2 text-sm text-(--text) placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none scrollbar-none"
        rows={3}
        {...register("message")}
      />

      {errors.message && (
        <p className="text-red-500">{errors.message?.message}</p>
      )}

      <div className="flex justify-end mt-2">
        <Button
          label={loading ? "Posting..." : "Leave a comment"}
          disabled={!message.trim() || loading}
          type="submit"
          className="px-4 py-1.5 text-sm rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-40 transition cursor-pointer"
        />
      </div>
    </form>
  );
}
