
export function UtilChangeToAlpha(letter) {
    letter = letter
        .toLowerCase()
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
        .replace(/ì|í|ị|ỉ|ĩ/g, "i")
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
        .replace(/đ/g, "d")
        .replace(/\s+/g, "-") // Replace space = '-'
        .replace(/[^A-Za-z0-9_-]/g, "-") // Replace not number and not a-z, A-Z to "";
        // .replace(/-+/g, "-");    // Replace -
    return letter;
}
export function UtilHightLightName(name, keyword) {
    const keywordAlpha = UtilChangeToAlpha(keyword);
    const nameAlpha = UtilChangeToAlpha(name);
    let nameArray = name.split('');

    const result = [];
    let i = 0;
    while (i < nameAlpha.length) {
        let index = i;
        if (nameAlpha[i] === keywordAlpha[0]) {
            let next = true, j = 0;
            let temp = '';
            while (next && j < keywordAlpha.length) {
                if (nameAlpha[i] === keywordAlpha[j]) {
                    temp += nameArray[i];
                    i++; j++;
                }
                else next = false;
            }
            if (next) {
                result.push(<mark className="high-light">{temp}</mark>)
            }
            else {
                result.push(nameArray[index]);
                i = index + 1;
            }
        }
        else {
            result.push(nameArray[i]);
            i++;
        }
    };
    result.join('');
    return result;
}

export function compareTime(time) {
    // 1 hour = 3600s
    // 1 day = 86400s
    let result = null;
    const created = new Date(time);
    const now = Date.now();
    const different = Math.floor((now  - created) / 1000);
    if (different < 60) {
        return `${different} giây trước`;
    }
    else if (different < 3600) {
        result = Math.floor(different / 60);
        return `${result} phút trước`;
    }
    else if (different < 86400) {
        result = Math.floor(different / 3600);
        return `${result} giờ trước`;
    }
    else if (different >= 86400) {
        return `${time.slice(0, -5)}`
    }
}




