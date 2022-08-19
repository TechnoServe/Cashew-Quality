import * as React from 'react';
import {Strings} from "../../core/utils";
import {StepComponent} from '../components/layouts/StepComponent';
import {snakeCase} from "lodash"
import i18n from 'i18n-js';

let qar_data = {}

export function getInputData(qar) {
    qar_data = {...qar_data, ...qar}

    // Remove blank attributes from an Object in Javascript
    Object.keys(qar_data).forEach((key) => (qar_data[key] == null) && delete qar_data[key]);

    return qar_data
}

/* Step 1 of 10: Weight of Nuts */
export function StepOneScreen({route}) {
    if (route.params?.sourceImage) {
    }
    getInputData(route.params?.qar)
    return (
        <StepComponent
            title={i18n.t('Step 1 of 10')}
            step_name={snakeCase(Strings.STEP_ONE_TITLE)}
            request={route.params?.request}
            backButton={Strings.HOME_SCREEN_NAME}
            nextButton={Strings.STEP_TWO_SCREEN_NAME}
            infoText={i18n.t('Step 1 Instructions')}
            metrics="g"
            progress={2 / 11}
            placeholder={i18n.t('nutsWeight')}
            sourceImage={route.params?.sourceImage}
            entries={false}
        />
    );
}

/* Step 2 of 10: Number of Nuts */
export function StepTwoScreen({route}) {
    if (route.params?.sourceImage) {
    }
    getInputData(route.params?.qar)
    return (
        <StepComponent
            title={i18n.t('Step 2 of 10')}
            step_name={snakeCase(Strings.STEP_TWO_TITLE)}
            request={route.params?.request}
            backButton={Strings.STEP_ONE_SCREEN_NAME}
            nextButton={Strings.STEP_THREE_SCREEN_NAME}
            infoText={i18n.t('Step 2 Instructions')}
            // metrics={i18n.t("Nuts")}
            progress={3 / 11}
            placeholder={i18n.t('Nut count')}
            sourceImage={route.params?.sourceImage}
            entries={false}
        />
    );
}

/* Step 3 of 10: Moisture Content */
export function StepThreeScreen({route}) {
    if (route.params?.sourceImage) {
    }
    getInputData(route.params?.qar)
    return (
        <StepComponent
            title={i18n.t('Step 3 of 10')}
            step_name={snakeCase(Strings.STEP_THREE_TITLE)}
            request={route.params?.request}
            backButton={Strings.STEP_TWO_SCREEN_NAME}
            nextButton={Strings.STEP_FOUR_SCREEN_NAME}
            infoText={i18n.t('Step 3 Instructions')}
            metrics="%"
            progress={4 / 11}
            placeholder={i18n.t('step3Name')}
            sourceImage={route.params?.sourceImage}
            entries={false}
        />
    );
}

/* Step 4 of 10: Foreign Materials */
export function StepFourScreen({route}) {
    if (route.params?.sourceImage) {
    }
    getInputData(route.params?.qar)
    return (
        <StepComponent
            title={i18n.t('Step 4 of 10')}
            step_name={snakeCase(Strings.STEP_FOUR_TITLE)}
            request={route.params?.request}
            backButton={Strings.STEP_THREE_SCREEN_NAME}
            nextButton={Strings.STEP_FIVE_SCREEN_NAME}
            infoText={i18n.t('Step 4 Instructions')}
            metrics="g"
            progress={5 / 11}
            placeholder={i18n.t('Foreign materials')}
            sourceImage={route.params?.sourceImage}
            entries={false}
        />
    );
}

/* Step 5 of 10: Good Kernel */
export function StepFiveScreen({route}) {
    if (route.params?.sourceImage) {
    }
    getInputData(route.params?.qar)
    return (
        <StepComponent
            title={i18n.t('Step 5 of 10')}
            step_name={snakeCase(Strings.STEP_FIVE_TITLE)}
            request={route.params?.request}
            backButton={Strings.STEP_FOUR_SCREEN_NAME}
            nextButton={Strings.STEP_SIX_SCREEN_NAME}
            infoText={i18n.t('Step 5 Instructions')}
            metrics="g"
            progress={6 / 11}
            placeholder={i18n.t('Good Kernel')}
            sourceImage={route.params?.sourceImage}
            entries={false}
            siteLocation={route.params?.siteLocation}
        />
    );
}

/* Step 6 of 10: Spotted Kernel */
export function StepSixScreen({route}) {
    if (route.params?.sourceImage) {
    }
    return (
        <StepComponent
            title={i18n.t('Step 6 of 10')}
            step_name={snakeCase(Strings.STEP_SIX_TITLE)}
            request={route.params?.request}
            backButton={Strings.STEP_FIVE_SCREEN_NAME}
            nextButton={Strings.STEP_SEVEN_SCREEN_NAME}
            infoText={i18n.t('Step 6 Instructions')}
            metrics="g"
            progress={7 / 11}
            placeholder={i18n.t('Spotted Kernel')}
            sourceImage={route.params?.sourceImage}
            entries={true}
        />
    );
}

/* Step 7 of 10: Immature Kernel */
export function StepSevenScreen({route}) {
    if (route.params?.sourceImage) {
    }
    return (
        <StepComponent
            title={i18n.t('Step 7 of 10')}
            step_name={snakeCase(Strings.STEP_SEVEN_TITLE)}
            request={route.params?.request}
            backButton={Strings.STEP_SIX_SCREEN_NAME}
            nextButton={Strings.STEP_EIGHT_SCREEN_NAME}
            infoText={i18n.t('Step 7 Instructions')}
            metrics="g"
            progress={8 / 11}
            placeholder={i18n.t('Immature Kernel')}
            sourceImage={route.params?.sourceImage}
            entries={true}
        />
    );
}

/* Step 8 of 10: Oily Kernel */
export function StepEightScreen({route}) {
    if (route.params?.sourceImage) {
    }
    return (
        <StepComponent
            title={i18n.t('Step 8 of 10')}
            step_name={snakeCase(Strings.STEP_EIGHT_TITLE)}
            request={route.params?.request}
            backButton={Strings.STEP_SEVEN_SCREEN_NAME}
            nextButton={Strings.STEP_NINE_SCREEN_NAME}
            infoText={i18n.t('Step 8 Instructions')}
            metrics="g"
            progress={9 / 11}
            placeholder={i18n.t('Oily Kernel')}
            sourceImage={route.params?.sourceImage}
            entries={true}
        />
    );
}

/* Step 9 of 10: Bad kernel */
export function StepNineScreen({route}) {
    if (route.params?.sourceImage) {
    }
    return (
        <StepComponent
            title={i18n.t('Step 9 of 10')}
            step_name={snakeCase(Strings.STEP_NINE_TITLE)}
            request={route.params?.request}
            backButton={Strings.STEP_EIGHT_SCREEN_NAME}
            nextButton={Strings.STEP_TEN_SCREEN_NAME}
            infoText={i18n.t('Step 9 Instructions')}
            metrics="g"
            progress={10 / 11}
            placeholder={i18n.t('Bad Kernel')}
            sourceImage={route.params?.sourceImage}
            entries={true}
        />
    );
}

/* Step 10 of 10: Void kernel */
export function StepTenScreen({route}) {
    if (route.params?.sourceImage) {
    }
    return (
        <StepComponent
            title={i18n.t('Step 10 of 10')}
            step_name={snakeCase(Strings.STEP_TEN_TITLE)}
            request={route.params?.request}
            backButton={Strings.STEP_NINE_SCREEN_NAME}
            nextButton={Strings.REVIEW_SCREEN_NAME}
            infoText={i18n.t('Step 10 Instructions')}
            metrics="g"
            progress={11 / 11}
            placeholder={i18n.t('Void Kernel')}
            sourceImage={route.params?.sourceImage}
            entries={true}
        />
    );
}
