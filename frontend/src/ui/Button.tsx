type ButtonProps = {
    label?: string;
    onClick?: () => void;
    variant?: "primary" | "danger";
    className? : string;
    disabled? : boolean;
    children? : React.ReactNode
  };
  
  export default function Button({
    label,
    onClick,
    variant,
    className,
    disabled,
    children
  }: ButtonProps) {
    const baseStyle = "rounded";
  
    const styles = {
      primary: "bg-blue-500 hover:bg-blue-600",
      danger: "bg-red-500 hover:bg-red-600",
    };
  
    return (
      <button
        onClick={onClick}
        className={`${baseStyle} ${styles[variant]} ${className}`}
        disabled={disabled}
      >
        {children ?? label}
      </button>
    );
  }