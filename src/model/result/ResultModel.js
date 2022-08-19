export function ResultModel(_id, request_id, kor, defective_rate, foreign_mat_rate, moisture_content, nut_count, created_at) {
    this._id = _id;
    this.request_id = request_id;
    this.kor = kor;
    this.defective_rate = defective_rate;
    this.foreign_mat_rate = foreign_mat_rate;
    this.moisture_content = moisture_content;
    this.nut_count = nut_count;
    this.created_at = created_at;
}
