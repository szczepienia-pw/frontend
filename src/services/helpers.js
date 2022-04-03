const toastDuration = 3000

export const errorToast = (toast, detail = "An error occured", err = {}) => {
    toast.add({
        severity: "error",
        summary: err?.response?.statusText || "Error",
        detail: err?.response?.data?.msg || detail,
        life: toastDuration,
    })
}

export const successToast = (toast, detail) => {
    toast.add({
        severity: "success",
        summary: "Success",
        detail: detail,
        life: toastDuration,
    })
}