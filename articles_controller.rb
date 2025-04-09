class ArticlesController < ApplicationController
    def index
        @articles = Article.page(params[:page]).per(5)
        count = Article.count
        respond_to do |format|
            format.html
            format.json{ render json:{articles: @articles.as_json(only: [:id, :title]), current_user: current_user, count: count}, layout: false}
        end
      end
    
    def show
        begin
            @article = Article.find(params[:id])
            @user = User.find(@article.user_id)
            res = false
           current_user_id = nil
           @blogcomments = BlogComment.where(article_id: params[:id]).page(params[:page]).per(5)
           count = BlogComment.where(article_id: params[:id]).count
           
            if current_user.nil?
                user_not_logged = true
            else
                current_user_id = current_user.id
            end

            if current_user == @user
                res = true
            end
                respond_to do |format|
                format.html
                format.json { render json: { article: @article.as_json(only: [:id, :title, :content]),
                 res: res.as_json, 
                comments: @blogcomments.as_json,
                user_not_logged: user_not_logged.as_json,
                user: @user.as_json(only: [:name]),
            current_user_id: current_user_id,
        count: count},

                 layout: false }
            end
        rescue
            respond_to do |format|
                format.html
                format.json{ render json:{not_found: true}, layout: false}
            end
        end
    end

    def new
        @article = Article.new
    end

    def create
        begin
        res = false
        @article = Article.new(create_params)
        @article.user_id = current_user&.id

        if current_user.nil?
            res= true
        end
        messages = []
        if @article.save
            messages << "Article created successfully"
            respond_to do |format|
                format.html {redirect_to article_path(@article)}
                format.json { render json: {article_id: @article.as_json(only: [:id]), messages: messages}, layout: false }
            end
        else
            
            if @article.title.nil? || @article.title.strip.empty?
              messages << "Title can't be blank"
            end
            
            if @article.content.nil? || @article.content.strip.empty?
              messages << "Content can't be blank"
            end
            respond_to do |format|
              format.html
              format.json { render json: { messages: messages }, layout: false }
            end
            
        end
    rescue
    end
    end

    def edit
        begin
            @article = Article.find(params[:id])
            user = User.find(@article.user_id)
            if current_user != user
                sign_out current_user
                return
            end
        rescue
            not_found
        end
    end

    def update
        begin
        @article = Article.find(params[:id])
        response = "Article updated successfully"
        @article.update(article_params)
        respond_to do |format|
        format.html
        format.json { render json: { response: response.as_json}}
    end
rescue
    not_found
end
    end

    def destroy
        begin
        article = Article.find(params[:id])
        user = User.find(article.user_id)
        if current_user.id != user.id
            not_found
            return
        end
        article.destroy
        response = "Article destroyed successfully"
        respond_to do |format|
        format.html
        format.json { render json: { response: response.as_json}}
    end
rescue
    not_found
end
end

    def not_found
    end

    private

    def article_params
      params.require(:article).permit(:id, :title, :content)
    end
    
    def create_params
        params.permit(:title, :content)
    end

    def delete_params
        params.permit(:id)
    end
end
