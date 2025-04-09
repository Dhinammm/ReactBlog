class Article < ApplicationRecord
    belongs_to :user
    has_many :blog_comments, dependent: :destroy
    validates :title, presence: true
    validates :content, presence: true
end
