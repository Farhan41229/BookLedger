export const catchAsyncError = (theFunction) =>  {
    Promise.resolve(passedFunction(req, res, next)).catch(next);
}