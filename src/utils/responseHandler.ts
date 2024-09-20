export const successResponse = (res: any, message: string, data: any = null) => {
    return res.status(200).json({ message, data });
  };
  
  export const errorResponse = (res: any, message: string, error: any) => {
    return res.status(500).json({ message, error });
  };
  