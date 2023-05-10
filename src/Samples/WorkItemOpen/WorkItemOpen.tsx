import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import  "./WorkItemOpen.scss";
import { css } from "azure-devops-ui/Util";

import { Button } from "azure-devops-ui/Button";
import { ObservableArray, ObservableValue } from "azure-devops-ui/Core/Observable";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { ListSelection } from "azure-devops-ui/List";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { TextField } from "azure-devops-ui/TextField";

import { CommonServiceIds, getClient, IProjectPageService } from "azure-devops-extension-api";
import { IWorkItemFormNavigationService, WorkItemTrackingRestClient, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";

import { showRootComponent } from "../../Common";


import * as Iteracion from "./Iteracion";

import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ISimpleListCell } from "azure-devops-ui/List";
import { IStatusProps, Status, Statuses, StatusSize } from "azure-devops-ui/Status";

import {
    Table,
    ColumnMore,
    ColumnSelect,
    ISimpleTableCell,
    renderSimpleCell,
    TableColumnLayout,
} from "azure-devops-ui/Table";


//const [losDatos,setLosDatos] = React. useState<ITableItem[]>([]);

 interface ITableItem extends ISimpleTableCell {
    id: string;
    nombre: ISimpleListCell;
    inicio: string;
    fin: string;
}



class WorkItemOpenContent extends React.Component<{}, {losDatos:ArrayItemProvider<ITableItem> }> {

    private workItemIdValue = new ObservableValue("1");
    private workItemTypeValue = new ObservableValue("Bug");
    private selection = new ListSelection();
    private workItemTypes = new ObservableArray<IListBoxItem<string>>();

//    public losDatos = new ArrayItemProvider<ITableItem>([]);

    constructor(props: {}) {
        super(props);
        this.state = {
            losDatos : new ArrayItemProvider<ITableItem>([])
          };
    }

     public fixedColumns = [
        {
            id: "id",
            name: "id",
            readonly: true,
            renderCell: renderSimpleCell,
            width: new ObservableValue(-30),
        },
        {
            columnLayout: TableColumnLayout.singleLinePrefix,
            id: "nombre",
            name: "nombre",
            readonly: true,
            renderCell: renderSimpleCell,
            width: new ObservableValue(-30),
        },
        {
            columnLayout: TableColumnLayout.none,
            id: "inicio",
            name: "inicio",
            readonly: true,
            renderCell: renderSimpleCell,
            width: new ObservableValue(-20),
        },
        {
            columnLayout: TableColumnLayout.none,
            id: "fin",
            name: "fin",
            readonly: true,
            renderCell: renderSimpleCell,
            width: new ObservableValue(-20),
        },
    ];


    public renderStatus = (className?: string) => {
        return (
            <Status
                {...Statuses.Success}
                ariaLabel="Success"
                className={css(className, "bolt-table-status-icon")}
                size={StatusSize.s}
            />
        );
    };
    


    

    // public rawTableItems: ITableItem[] = [
    //     {
    //         id: '41',
    //         descripcion: "M",
    //         nombre: { iconProps: { render: this.renderStatus }, text: "Francisco Díaz" },
    //     },
    //     {
    //         id: '49',
    //         descripcion: "F",
    //         nombre: { iconProps: { iconName: "Home", ariaLabel: "Home" }, text: "Sharon Monroe" },
    //     },
    //     {
    //         id: '18',
    //         descripcion: "F",
    //         nombre: { iconProps: { iconName: "Home", ariaLabel: "Home" }, text: "Lucy Booth" },
    //     },
    // ];
    public rawTableItems02 : ITableItem[] = [];
    
    // public tableItems = new ArrayItemProvider<ITableItem>(rawTableItems);

    // public tableItemsNoIcons = new ArrayItemProvider<ITableItem>(
    //     this.rawTableItems.map((item: ITableItem) => {
    //         const newItem = Object.assign({}, item);
    //         newItem.nombre = { text: newItem.nombre.text };
    //         return newItem;
    //     })
    // );
    


    public async onOpenIteraciones() : Promise<String> {

        fetch('https://dev.azure.com/ThorDevOps/Perseo/perseo%20Team/_apis/work/teamsettings/iterations?api-version=7.0', {
            method: 'GET',
            headers: {
               'Authorization':'Basic Omd5cTV2c29tNmNwZXR2NzdoMnA3ZGlyaHpoZ3huamVjeG9sYXpjNDNraGcyaW1kbXU1dGE=',
            }}).then((response) => response.json())
             .then((data) => {
          

                 data.value.map((item: Iteracion.TeamSettingsIteration) => {
                    this.rawTableItems02.push({
                    id: item.id,
                    inicio: item.attributes.startDate.toLocaleDateString("es-MX") ,
                    fin: item.attributes.finishDate.toLocaleDateString("es-MX")   ,
                    nombre: { iconProps: { render: this.renderStatus }, text: item.name },
                    
                })
                console.log(item);

                });

               let tableItemsNoIcons = new ArrayItemProvider<ITableItem>(
                    this.rawTableItems02.map((item: ITableItem) => {
                        const newItem = Object.assign({}, item);
                        newItem.nombre = { text: newItem.nombre.text };
                        console.log(newItem);
                        return newItem;
                    })
                );
                this.setState({losDatos: tableItemsNoIcons});
                 
             })
             .catch((err) => {
                console.error(err.message);
             });

        return '';
    }


    public componentDidMount() {
        SDK.init();
        this.loadWorkItemTypes();
    }
    

    public render(): JSX.Element {

        return (
            <>
                <Header title="Ejemplo de los workitem WIT" className="bgblue" />

                <div className="hub-view explorer">
        <div className=" splitter horizontal hub-splitter">
            <div className="leftPane">
                <div className="left-hub-content">
                    <div className="menu-container"></div>
                </div>
                <div className="sample-form-section flex-row flex-center">
                        <TextField className="sample-work-item-id-input" label="Id existente" value={this.workItemIdValue.value.toString()} onChange={(ev, newValue) => { this.workItemIdValue.value = newValue; }} />
                        <Button className="sample-work-item-button" text="Open..." onClick={() => this.onOpenExistingWorkItemClick()} />
                    </div>
                    <div className="sample-form-section flex-row flex-center">
                        <div className="flex-column col-md-3">
                            <label htmlFor="work-item-type-picker">Tipo de elemento de trabajo:</label>
                            <Dropdown<string>
                                className="sample-work-item-type-picker form-control"
                                items={this.workItemTypes}
                                onSelect={(event, item) => { this.workItemTypeValue.value = item.data! }}
                                selection={this.selection}
                            />
                        </div>
                        <Button className="sample-work-item-button" text="New..." onClick={() => this.onOpenNewWorkItemClick()} />
                    </div>
                    <div className="sample-form-section flex-row flex-center">
                        <Button className="sample-work-item-button" text="Iteraciones..." onClick={() => this.onOpenIteraciones()} />
                    </div>

            </div>
            <div className="handleBar"></div>
            <div className="rightPane">
                <div className="hub-title"></div>
                <div className="right-hub-content" id= "derecho" >
               <Table 
                    ariaLabel="Basic table"
                    columns={this.fixedColumns}
                    itemProvider={this.state.losDatos}
                    role="table"
                    className="table-example"
                    containerClassName="h-scroll-auto"
                    pageSize= {50}
                    scrollable={true}   
                    showScroll={true}
               />
                    
                </div>
            </div>
        </div>
    </div>

                </>
        );
    }



    private async loadWorkItemTypes(): Promise<void> {

        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();

        let workItemTypeNames: string[];

        if (!project) {
            workItemTypeNames = [ "Issue" ];
        }
        else {
            const client = getClient(WorkItemTrackingRestClient);
            const types = await client.getWorkItemTypes(project.name);
            workItemTypeNames = types.map(t => t.name);
            workItemTypeNames.sort((a, b) => localeIgnoreCaseComparer(a, b));
        }

        this.workItemTypes.push(...workItemTypeNames.map(t => { return { id: t, data: t, text: t } }));
        this.selection.select(0);
    }

    private async onOpenExistingWorkItemClick() {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        navSvc.openWorkItem(parseInt(this.workItemIdValue.value));
    };





    private async onOpenNewWorkItemClick() {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        navSvc.openNewWorkItem(this.workItemTypeValue.value, { 
            Title: "Opened a work item from the Work Item Nav Service",
            Tags: "extension;wit-service",
            priority: 1,
            "System.AssignedTo": SDK.getUser().name,
         });
    };
}

showRootComponent(<WorkItemOpenContent />);