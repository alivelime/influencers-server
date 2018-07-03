
export const isURL = (string) => {
	return /^https?:\/\//.test(string);
}

export const errorIfEmpty = value => (value ? undefined : 'Required');
export const errorIfNumber = value => value && !isNaN(value) ? '数値以外を入力してください' : undefined;
export const errorIfNotURL = string => value && !/^https?:\/\//.test(string) ? 'URLを入力してください' : undefined;
