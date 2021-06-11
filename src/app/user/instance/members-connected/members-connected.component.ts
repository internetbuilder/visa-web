import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Instance, User} from '@core';
import {SocketIOTunnel} from '@illgrenoble/visa-guacamole-common-js';
import {VirtualDesktopManager} from '@vdi';
import {Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'visa-instance-members-connected-dialog',
    styleUrls: ['./members-connected.component.scss'],
    templateUrl: './members-connected.component.html',
})
export class MembersConnectedComponent implements OnInit {

    private _users = [];
    private _user: User;
    private _instance: Instance;
    private _manager: VirtualDesktopManager;

    get manager(): VirtualDesktopManager {
        return this._manager;
    }

    set manager(value: VirtualDesktopManager) {
        this._manager = value;
    }
    get instance(): Instance {
        return this._instance;
    }

    set instance(value: Instance) {
        this._instance = value;
    }
    get user(): User {
        return this._user;
    }

    set user(value: User) {
        this._user = value;
    }

    get users(): any[] {
        return this._users;
    }

    set users(value: any[]) {
        this._users = value;
    }

    constructor(private dialogRef: MatDialogRef<MembersConnectedComponent>,
                @Inject(MAT_DIALOG_DATA) private data: any) {
        this._instance = data.instance;
        this._manager = data.manager;
        this._user = data.user;
        data.users$.subscribe((users) => {
            this.users = users;
        });
    }

    public ngOnInit(): void {
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public canDelete(user: User): boolean {
        if (this._user == null) {
            return false;
        }
        if (this._instance.membership.role !== 'OWNER') {
            return false;
        }
        if (this._instance.membership.user.id === user.id) {
            return false;
        }
        return true;
    }

    public dropUser(event, user: User): void {
        event.preventDefault();

        const tunnel = this._manager.getTunnel() as SocketIOTunnel;
        const socket = tunnel.getSocket();

        socket.emit('access:revoked', {userId: user.id});
    }

}
