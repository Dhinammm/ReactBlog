class BlogCommentsController < ApplicationController
    def create
        @comment = BlogComment.new(params.permit(:content, :article_id))
        @comment.update(user_id: current_user.id, article_id: params[:article_id])
        if current_user 
        @comment.save
        else 
            respond_to do |format|
                format.html
                format.json { render json: { message: "Please log in to post comments "}}
            end
    end

    end

    def destroy
            comment = BlogComment.find(params[:id])
            @page = Article.find(comment.article_id)
            if current_user.id == comment.user_id
            comment.destroy
            else
                respond_to do |format|
                    format.html
                    format.json { render json: { message: "You are allowed to delete this comment "}}
                end
        end
    end
    def allow_params
        params.permit(:title, :content)
    end
end
