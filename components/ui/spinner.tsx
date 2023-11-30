import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "rounded-full inline-block box-border animate-spin border-secondary border-b-primary",
  {
    variants: {
      size: {
        default: "w-20 h-20",
        sm: "w-10 h-10",
        lg: "w-40 h-40",
      },
      thickness: {
        default: "border-4",
        sm: "border-2",
        lg: "border-6",
      },
    },
    defaultVariants: {
      size: "default",
      thickness: "default",
    },
  },
);

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

const Spinner = ({ className, size, thickness, ...props }: SpinnerProps) => {
  return (
    <span
      className={cn(spinnerVariants({ size, thickness, className }), className)}
      {...props}
    />
  );
};

export default Spinner;
