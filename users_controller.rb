class UsersController < ApplicationController
    def index
        @users = User.page(params[:page]).per(5)
            count = User.count
        respond_to do |format|
            format.html
            format.json{ render json:{users: @users.as_json(only: [:id, :name]), current_user: current_user, count: count}, layout: false}
        end
    end

    def show
        begin
            res = false
            fake = false
            @user = User.find(params[:id])
            @articles = Article.where("user_id = ?",params[:id]).page(params[:page]).per(5)
            count =  Article.where("user_id = ?",params[:id]).count
            if current_user != @user
                fake = true
            end 

            respond_to do |format|
                format.html
                format.json { render json: { articles: @articles.as_json(only: [:id, :title]), user: @user.as_json(only: [:id, :name]),
                 res: res.as_json, fake: fake.as_json, count: count.as_json}, layout: false }
            end
        rescue
            res= true
            respond_to do |format|
                format.html
                format.json { render json: { res: res.as_json}, layout: false }
            end
        end
    end

    def new 
        @user = User.new
    end

    def create

        begin
        @user = User.new(user_params)
        respond_to do |format|
            format.html {redirect_to user_path(@user)}
            format.json { render json: {user_id: @user.as_json(only: [:id])}, layout: false }
        end
    rescue
        res= true
        respond_to do |format|
            format.html
            format.json { render json: { res: res.as_json}, layout: false }
        end
    end
end
    def destroy
        begin
            res =false
        user = User.find(params[:id])
        
        if current_user != user
            res=true
        else
            user.destroy
        end
        respond_to do |format|
            format.html
            format.json { render json: { res: res.as_json}, layout: false }
        end
        rescue
            res= true
            respond_to do |format|
                format.html
                format.json { render json: { res: res.as_json}, layout: false }
            end
    end
end

    def not_found
    end

    def details
        if current_user
            res=true
        else
            res=false
        end
        puts res
        respond_to do |format|
            format.json { render json: { res: res.as_json }, layout: false}   
        end
    end
    private
    def user_params
       # params.require(user: [:name, :email, :password])
       params.require(:user).permit(:name, :email, :password)
    end

end