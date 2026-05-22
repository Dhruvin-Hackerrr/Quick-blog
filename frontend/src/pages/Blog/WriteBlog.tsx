import { useForm, Controller } from "react-hook-form";
import { MoveLeft, UserRound } from "lucide-react";
import BlogEditor from "../../components/Blog/BlogEditor";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import CategorySelect from "../../components/Blog/ui/CategorySelect";

import { showError, showSuccess, showWarning } from "../../utils/toast";
import { fetchAuthorBlogById, publishBlog, updateblog } from "../../api/blog";
import {
  publishBlogValidation,
  updateBlogValidation,
} from "../../validations/blogSchema";
import {
  type publishBlogData,
  type updateBlogData,
} from "../../types/blogtype";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

export default function WriteBlogPage() {
  const [originalData, setOriginalData] = useState<publishBlogData | null>(
    null
  );
  const { id } = useParams();
  const isEditMode = !!id;
  const schema = isEditMode ? updateBlogValidation : publishBlogValidation;
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<publishBlogData | updateBlogData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      category: "PRODUCTIVITY",
      slugDisplay: "",
      body: {
        type: "doc",
        content: [],
      },
    },
  });
  const navigate = useNavigate();

  const onInvalid = (errors) => {
    if (errors.body?.message) {
      showError(errors.body.message);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchBlog = async () => {
        try {
          const res = (await fetchAuthorBlogById(id)).data.data;
          setOriginalData(res);
          reset({
            title: res.title,
            slugDisplay: res.slugDisplay,
            category: res.category,
            body: res.body,
          });
        } catch (error) {
          showError(error.message);
        }
      };
      fetchBlog();
    }
  }, [id]);

  const getChangedFields = (
    data: updateBlogData,
    original: publishBlogData
  ) => {
    const changes = {};

    Object.keys(data).forEach((key) => {
      if (data[key] !== original[key]) {
        changes[key] = data[key];
      }
    });

    return changes;
  };

  const onSubmit = async (data: publishBlogData) => {
    try {
      if (!isDirty) return showWarning("There is Nothing to update");

      if (isDirty && isEditMode) {
        const updateData = getChangedFields(data, originalData);

        const res = (await updateblog(updateData, id)).data;
        navigate("/dashboard");
        showSuccess(res.message);
        return;
      }

      await publishBlog(data);
      reset({
        title: "",
        category: "PRODUCTIVITY",
        slugDisplay: "",
        body: {
          type: "doc",
          content: [],
        },
      });
      navigate("/dashboard");
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong";
      showError(message);
      console.log("err :", message)
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="h-screen bg-(--bg) text-(--text) flex flex-col p-10"
    >
      {/* ================= NAVBAR ================= */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center text-(--muted) hover:text-(--text) transition cursor-pointer"
          >
            <MoveLeft size={26} />
          </Button>

          <span className="text-sm text-(--muted)">Back</span>
        </div>
        <h1 className="text-2xl font-semibold text-(--text)">
          Create a new story
        </h1>
        <p className="text-xs text-(--muted)">Draft → Refine → Publish</p>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col min-h-0 h-full bg-(--surface)">
          {/* ================= TITLE ================= */}
          <Input
            disabled={isSubmitting}
            placeholder="Enter blog title..."
            error={errors?.title?.message}
            className="w-full bg-transparent text-4xl font-bold outline-none placeholder-(--muted) border-b-2"
            {...register("title")}
          />

          {/* ================= META ================= */}
          <div className="flex flex-col sm:flex-row gap-4 my-8">
            {/* CATEGORY */}
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <CategorySelect value={field.value} onChange={field.onChange} />
              )}
            />

            {/* SLUG */}
            <div className="flex-1">
            <Input
              disabled={isSubmitting}
              placeholder="Add slug which improve SEO"
              error={errors?.slugDisplay?.message}
              className="w-full h-10 px-3 py-2 bg-(--bg) rounded-md! border-(-border) text-sm mt-0!"
              {...register("slugDisplay")}
            />
            </div>
          </div>

          {/* ================= AUTHOR ================= */}
          <div className="flex items-center gap-3 mb-6 text-gray-500">
            <div className="w-9 h-9 rounded-full bg-[#111827] flex items-center justify-center border border-gray-800">
              <UserRound size={18} />
            </div>
            <span className="text-sm">Writing as John Doe</span>
          </div>

          {/* ================= EDITOR ================= */}
          <div className="flex-1 min-h-0 rounded-lg bg-(--bg) border border-(--border)">
            <div className="h-full overflow-y-auto no-scrollbar">
              <Controller
                name="body"
                control={control}
                render={({ field }) => (
                  <BlogEditor
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="sticky bottom-0 border-t border-(--border) bg-(--bg) backdrop-blur mt-3">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <p className="text-(--muted)">
            Your voice can inspire someone somewhere.
          </p>

          <Button
            label={isSubmitting ? "Publishing..." : "Publish Now"}
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-1.5 rounded-md text-sm font-medium cursor-pointer bg-(--primary)"
          />
        </div>
      </div>
    </form>
  );
}
