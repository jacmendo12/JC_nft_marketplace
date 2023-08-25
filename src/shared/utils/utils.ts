
export function handleValidationResult(validationResult: any) {
    if (validationResult.error)
        throw new Error(JSON.stringify(validationResult.error.details));
}