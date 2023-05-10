import * as System from "azure-devops-extension-api/Common/System";


/**
 * The behavior of the work item types that are in the work item category specified in the BugWorkItems section in the Process Configuration
 */
export enum BugsBehavior {
    Off = 0,
    AsRequirements = 1,
    AsTasks = 2
}



/**
 * Base class for TeamSettings data contracts. Anything common goes here.
 */
export interface TeamSettingsDataContractBase {
    /**
     * Collection of links relevant to resource
     */
    _links: any;
    /**
     * Full http link to the resource
     */
    url: string;
}



export enum TimeFrame {
    Past = 0,
    Current = 1,
    Future = 2
}



export interface TeamIterationAttributes {
    /**
     * Finish date of the iteration. Date-only, correct unadjusted at midnight in UTC.
     */
    finishDate: Date;
    /**
     * Start date of the iteration. Date-only, correct unadjusted at midnight in UTC.
     */
    startDate: Date;
    /**
     * Time frame of the iteration, such as past, current or future.
     */
    timeFrame: TimeFrame;
}


/**
 * Represents a shallow ref for a single iteration.
 */
export interface TeamSettingsIteration extends TeamSettingsDataContractBase {
    /**
     * Attributes of the iteration such as start and end date.
     */
    attributes: TeamIterationAttributes;
    /**
     * Id of the iteration.
     */
    id: string;
    /**
     * Name of the iteration.
     */
    name: string;
    /**
     * Relative path of the iteration.
     */
    path: string;
}

