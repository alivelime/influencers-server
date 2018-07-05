
export const isURL = (string) => {
	return /^https?:\/\//.test(string);
}

export const errorIfEmpty = value => (value ? undefined : 'Required');
export const errorIfNumber = value => value && !isNaN(value) ? '数値以外を入力してください' : undefined;
export const errorIfNotURL = value => value && !/^https?:\/\//.test(value) ? 'URLを入力してください' : undefined;
