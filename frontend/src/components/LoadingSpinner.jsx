import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const className = `spinner spinner-${size}${fullScreen ? ' spinner-fullscreen' : ''}`;

  return (
    <div className={className} role="status" aria-label="Loading">
      <div className="spinner-leaf" />
    </div>
  );
};

export default LoadingSpinner;
