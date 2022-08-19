import {isEmpty} from "lodash";
import {ResultModel} from "../../model/result/ResultModel";
import {generatePushID} from "../../core/utils/id_generator";
import {getDefectiveRate, getForeignMaterialsRatio, getKOR} from "../../core/utils/calculations";


export function getCalculatedQarResults(qap_data) {

    if (!isEmpty(qap_data)) {
        // calculate the results
        const calcResults = calculateQapDataResults(qap_data)
        return new ResultModel(
            generatePushID(),
            qap_data.request_id,
            calcResults.kor,
            calcResults.defective_rate,
            calcResults.foreign_mat_rate,
            calcResults.moisture_content,
            calcResults.nut_count,
            (new Date()).toISOString(),
        )
        //nothing to return if not connected
    } else {
        //console.error("No QAP Data available.")
        return new ResultModel()
    }
}

export function calculateQapDataResults(qap_data) {
    // always get from local from local

    return {
        nut_count: qap_data['nut_count'].with_shell,
        moisture_content: qap_data['moisture_content'].with_shell,
        foreign_mat_rate: getForeignMaterialsRatio(qap_data['foreign_materials'].with_shell),
        kor: getKOR(
            qap_data['good_kernel'].with_shell,
            qap_data['spotted_kernel'].without_shell,
            qap_data['immature_kernel'].without_shell
        ),
        defective_rate: getDefectiveRate(
            qap_data['spotted_kernel'].with_shell,
            qap_data['immature_kernel'].with_shell,
            qap_data['oily_kernel'].with_shell,
            qap_data['bad_kernel'].with_shell,
            qap_data['void_kernel'].with_shell,
        )
    }
}
