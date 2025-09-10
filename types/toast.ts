export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition = 
  | 'top-center' 
  | 'top-right' 
  | 'top-left' 
  | 'bottom-center' 
  | 'bottom-right' 
  | 'bottom-left';

export interface ToastOptions {
  message: string;
  duration?: number;
  position?: ToastPosition;
}

export interface CustomToastOptions extends ToastOptions {
  type: ToastType;
}
