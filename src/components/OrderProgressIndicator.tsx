import React from 'react';
import { cn } from '@/lib/utils'; // For conditional class names

interface OrderProgressStep {
  name: string;
  status: 'completed' | 'current' | 'pending';
  timestamp?: string; // e.g., "10:30 AM" or "July 20, 2024"
}

interface OrderProgressIndicatorProps {
  steps: OrderProgressStep[];
  orientation?: 'horizontal' | 'vertical';
}

const OrderProgressIndicator: React.FC<OrderProgressIndicatorProps> = ({
  steps,
  orientation = 'horizontal',
}) => {
  console.log("Rendering OrderProgressIndicator with steps:", steps.length);

  if (!steps || steps.length === 0) {
    return <p className="text-muted-foreground">No order progress to display.</p>;
  }

  return (
    <div
      className={cn(
        "flex w-full",
        orientation === 'horizontal' ? "flex-row items-start" : "flex-col"
      )}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.name}>
          <div
            className={cn(
              "flex items-center",
              orientation === 'horizontal' ? "flex-col flex-1" : "flex-row items-center mb-4 w-full"
            )}
          >
            <div className="flex items-center">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                  step.status === 'completed' && "bg-green-500 text-white",
                  step.status === 'current' && "bg-blue-500 text-white ring-2 ring-blue-500 ring-offset-2",
                  step.status === 'pending' && "bg-gray-300 text-gray-600"
                )}
              >
                {step.status === 'completed' ? '✓' : index + 1}
              </div>
              {orientation === 'vertical' && (
                <div className="ml-3 text-left">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      step.status === 'current' && "text-blue-600",
                      step.status === 'completed' && "text-green-600",
                      step.status === 'pending' && "text-gray-500"
                    )}
                  >
                    {step.name}
                  </p>
                  {step.timestamp && (
                    <p className="text-xs text-muted-foreground">{step.timestamp}</p>
                  )}
                </div>
              )}
            </div>
            {orientation === 'horizontal' && (
              <div className="mt-1 text-center">
                <p
                  className={cn(
                    "text-xs font-medium",
                    step.status === 'current' && "text-blue-600",
                    step.status === 'completed' && "text-green-600",
                    step.status === 'pending' && "text-gray-500"
                  )}
                >
                  {step.name}
                </p>
                {step.timestamp && (
                  <p className="text-xs text-muted-foreground">{step.timestamp}</p>
                )}
              </div>
            )}
          </div>

          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-auto border-t-2 transition-colors duration-500 ease-in-out",
                step.status === 'completed' ? "border-green-500" : "border-gray-300",
                orientation === 'horizontal' ? "mt-3 mx-2" : "h-8 w-0.5 ml-[11px] -my-4 border-t-0 border-l-2" // Vertical line
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default OrderProgressIndicator;