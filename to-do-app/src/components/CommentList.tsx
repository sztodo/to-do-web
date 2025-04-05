import { Comment } from "../types/interfaces";
import "./CommentList.css";
interface CommentListProps {
    comments: Comment[];
  }
  
  const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };
  
    if (comments.length === 0) {
      return <div className="no-comments">No comments yet.</div>;
    }
  
    return (
      <div className="comment-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <span className="comment-author">{comment.username}</span>
              <span className="comment-date">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="comment-content">{comment.content}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default CommentList;