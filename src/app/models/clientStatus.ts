export class ClientStatus {
    public getStatus = function (status) {
        return this.statusTypes[status];
    };

    public allStatusTypes = function () {
        return Object.keys(this.statusTypes);
    };

    public statusKnown = function (status) {
        return this.allStatusTypes().indexOf(status) > -1;
    };

    public statusTypes = {
        "Pending": [
            {
                name: "Activate",
                href: "#/client",
                subhref: "activate",
                icon: "icon-ok-sign",
                taskPermissionName: "ACTIVATE_CLIENT"
            },
            {
                name: "Close",
                href: "#/client",
                subhref: "close",
                icon: "fa fa-times-circle-o",
                taskPermissionName: "PERMANENT_CLOSE_CLIENT"
            }
        ],
        "Active": [
            {
                name: "Close",
                href: "#/client",
                subhref: "close",
                icon: "fa fa-times-circle-o",
                taskPermissionName: "PERMANENT_CLOSE_CLIENT"
            }
        ],
        "Transfer in progress": [
            {
                name: "Accept Transfer",
                href: "#/client",
                subhref: "acceptclienttransfer",
                icon: "icon-check-sign",
                taskPermissionName: "ACCEPTTRANSFER_CLIENT"
            },
            {
                name: "Reject Transfer",
                href: "#/client",
                subhref: "rejecttransfer",
                icon: "icon-remove",
                taskPermissionName: "REJECTTRANSFER_CLIENT"
            },
            {
                name: "Undo Transfer",
                href: "#/client",
                subhref: "undotransfer",
                icon: "icon-undo",
                taskPermissionName: "WITHDRAWTRANSFER_CLIENT"
            }
        ],
        "Transfer on hold": [
            {
                name: "Undo Transfer",
                href: "#/client",
                subhref: "undotransfer",
                icon: "icon-undo",
                taskPermissionName: "WITHDRAWTRANSFER_CLIENT"
            }
        ],
        "Assign Staff": {
            name: "Assign Staff",
            href: "#/client",
            subhref: "assignstaff",
            icon: "icon-user",
            taskPermissionName: "ASSIGNSTAFF_CLIENT"
        },
        "New Loan": {
            name: "New Loan",
            href: "#/newclientloanaccount",
            icon: "fa fa-plus",
            taskPermissionName: "CREATE_LOAN"

        }
    }

}