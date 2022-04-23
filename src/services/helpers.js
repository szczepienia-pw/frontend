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

export const objectDiff = (obj1, obj2) => {
    let res = {};
	Object.keys(obj1).forEach((key) => {
		if (typeof obj1[key] === "object") {
            let deepCompare = objectDiff(obj1[key], obj2[key]);
            if(Object.keys(deepCompare).length > 0) res[key] = deepCompare;
		} else if (obj1[key] != obj2[key]) {
			res[key] = obj1[key];
		}
	});
	return res;
};

export const formatTime = (date) => {
	const hours = new Date(date).getHours();
	const minutes = new Date(date).getMinutes();
	return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
};

export const formatDate = (date) => {
	const d = new Date(date);
	return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}, ${formatTime(date)}`;
}