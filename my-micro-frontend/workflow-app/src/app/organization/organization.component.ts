import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormService, SystemService } from '@my-micro-frontend/shared-core';
import { MessageService, TreeNode } from 'primeng/api';
import { TreeModule } from 'primeng/tree';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TreeModule, 
    OrganizationChartModule, 
    DialogModule, 
    InputTextModule, 
    SelectModule, 
    ButtonModule, 
    CheckboxModule, 
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss'
})
export class OrganizationComponent implements OnInit {

  files: TreeNode[] = [];
  selectedTeam: any = null;
  selectedOrganization: any = null;
  data: TreeNode[] = [];
  showEditModal = false
  titleList: any[] = [];
  selectedTitle: any = null;
  positionList: any[] = [];
  selectedPosition: any = null;
  showPositionEditModal = false;
  selectedEditPosition: any = null;
  subUserList: any[] = [];
  selectedSubUser: any = null;
  userList: any[] = [];
  selectedUser: any = null;
  newPersonModal = false;
  newPersonData = {
    name: '',
    pernr: '',
    plans: '',
    begda: null as any,
    endda: null as any,
    orgeh: '',
    stell: ''
  };
  createEndda: any = null;
  createBegda: any = null;
  addPositionModalShow = false;
  newPositionData = {
    name: '',
    objid: '',
    begda: null as any,
    endda: null as any,
    orgeh: '',
    isSapkali: false
  };
  exPersonModalShow = false;
  userListEx: any[] = [];
  selectedUserEx: any = null;
  
  constructor(
    public formService: FormService,
    public userService: SystemService,
    public messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getOrganizationList();
    this.titleListForDropdown();
    this.positionListForDropdown();
    this.getUserList();
  }

  expandAll() {
    this.files.forEach((node) => {
      this.expandRecursive(node, true);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  getOrganizationList() {
    return this.formService.getOrganizationList().subscribe((res: any) => {
      console.log('getOrganizationList API response:', res);
      if (res && res.response) {
        this.files = res.response;
      } else if (res && res.data) {
        this.files = res.data;
      } else if (Array.isArray(res)) {
        this.files = res;
      } else {
        this.files = [];
      }
      this.cdr.detectChanges();
    });
  }
  
  getOrganizationPeopleList(node: any) {
    return this.formService.getPeopleListByOrganizationId(node?.key).subscribe((res: any) => {
      this.data = [];
      this.data = res.response.map((element: any) => {
        return {
          label: element.label,
          data: element.data,
          expanded: true,
          children: element.children.map((e: any) => ({
            label: e.label,
            data: e.data,
            expanded: true,
            children: e.children.map((i: any) => ({
              label: i.label,
              data: i.data,
              expanded: true,
              children: i.children.map((t: any) => ({
                label: t.label,
                data: t.data,
                expanded: true,
                children: t.children.map((s: any) => ({
                  label: s.label,
                  data: s.data,
                  expanded: true,
                  children: []
                }))
              }))
            }))
          }))
        }
      })
    })
  }

  nodeSelect(event: any) {
    this.selectedTeam = event.node;
    this.getOrganizationPeopleList(event.node);
  }

  formatDateToInput(date: any) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  organizationSelect(event: any) {
    if (event.node.data.includes("PERS")) {
      var formattedData = event.node.data.replace("PERS ", "");
      this.formService.getEmployeeDetails(formattedData).subscribe((res: any) => {
        if (res.code == "200") {
          this.selectedOrganization = { ...res.response, begda: this.formatDateToInput(res.response.begda), endda: this.formatDateToInput(res.response.endda) };
          this.selectedTitle = this.titleList.find(item => item.id === this.selectedOrganization.stell);
          this.selectedPosition = this.positionList.find(item => item.id === this.selectedOrganization.plans);
          this.getAssignmentUserLink(this.selectedOrganization.id);
          this.showEditModal = true;
        }
      })
    }
    else if (event.node.data.includes("ORG")) {

    }
    else {
      this.selectedEditPosition = event.node;
      if (this.selectedEditPosition.children.length > 0) {
        this.selectedSubUser = { id: this.selectedEditPosition.children[0].data.split(" ")[1], name: this.selectedEditPosition.children[0].label };
      }
      var subUserListTemp: any[] = [];
      for (const element of this.data) {
        for (const subElement of element.children as any[]) {
          for (const subelement2 of subElement.children as any[]) {
            subUserListTemp.push({ id: subelement2.data.split(" ")[1], name: subelement2.label });
          }
        }
      }
      this.subUserList = subUserListTemp;
      this.getPeopleListByOrgeh(this.selectedTeam?.key)
      this.showPositionEditModal = true;
    }
  }

  leaving() {
    var employee: any = { ...(this.selectedOrganization || {}) };
    employee.plans = "99999999"; //İşten Ayrılma Kodu
    this.formService.updateEmployeeAssignment(employee).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: "Başarılı",
          detail: "Çıkış işlemi başarıyla gerçekleştirildi.",
        });
        this.getOrganizationPeopleList(this.selectedTeam);
        this.showEditModal = false;
      }
    })
  }

  titleListForDropdown() {
    return this.formService.getTitleList().subscribe((res: any) => {
      if (res.code == "200") {
        this.titleList = res.response.map((item: any) => ({ id: item.objid, name: item.text }));
      }
    });
  }

  changeSelectedTitle(newValue: any) {
    this.selectedTitle = newValue.value;
  }

  save() {
    var employee: any = { ...(this.selectedOrganization || {}) };
    employee.stell = this.selectedTitle?.id;
    employee.plans = this.selectedPosition?.id;
    this.formService.updateEmployeeAssignment(employee).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: "Başarılı",
          detail: "Güncelleme işlemi başarıyla gerçekleştirildi.",
        });
        this.getOrganizationPeopleList(this.selectedTeam);
        this.showEditModal = false;
      }
    })
  }

  positionListForDropdown() {
    return this.formService.getPositionList().subscribe((res: any) => {
      if (res.code == "200") {
        this.positionList = res.response.map((item: any) => ({ id: item.objid, name: item.text }));
      }
    });
  }

  changeSelectedPosition(newValue: any) {
    this.selectedPosition = newValue.value;
  }

  addPersonToPosition() {
    return this.formService.addPersonToPosition(this.selectedEditPosition?.data?.split(" ")[1], this.selectedSubUser?.id).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: "Başarılı",
          detail: "Pozisyona personel ekleme işlemi başarıyla gerçekleştirildi.",
        });
        this.getOrganizationPeopleList(this.selectedTeam);
        this.showPositionEditModal = false;
      }
    });
  }

  getUserList() {
    return this.userService.getUserList().subscribe((res: any) => {
      this.userList = res.map((item: any) => ({ id: item.id, name: item.userName + " " + item.userSurname }));
    });
  }

  addAssignmentLink() {
    if (this.selectedUser != null) {
      this.formService.createAssignmentLink({ userId: this.selectedUser.id, employeeAssignmentId: this.selectedOrganization.id }).subscribe((res: any) => {
        if (res.code == "200") {
          this.messageService.add({
            severity: "success",
            summary: "Başarılı",
            detail: "Pozisyona atama linki ekleme işlemi başarıyla gerçekleştirildi.",
          });
          this.getOrganizationPeopleList(this.selectedTeam);
          this.showEditModal = false;
        }
        else {
          this.messageService.add({
            severity: "error",
            summary: "Hata",
            detail: "Pozisyona atama linki ekleme işlemi sırasında bir hata oluştu.",
          });
        }
      });
    }
  }


  getAssignmentUserLink(assignmentId: any) {
    var userId = 0;
    this.formService.getAssignmentUserLink(assignmentId).subscribe((res: any) => {
      if (res.code == "200") {
        userId = res.response.userId
        if (userId != 0) {
          this.selectedUser = this.userList.find(item => item.id === userId);
        }
      }
    });
  }

  newPersonModalShow() {
    this.newPersonModal = true;
    this.newPersonData.plans = this.selectedEditPosition?.data?.split(" ")[1] || '';
    this.newPersonData.orgeh = this.selectedTeam?.key || '';
  }

  create() {
    var employee = {
      ...this.newPersonData, 
      stell: this.selectedTitle?.id, 
      endda: this.createEndda ? new Date(this.createEndda).toISOString() : null,
      begda: this.createBegda ? new Date(this.createBegda).toISOString() : null
    };
    return this.formService.createEmployeeAssignment(employee).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: "Başarılı",
          detail: "Personel ekleme işlemi başarıyla gerçekleştirildi.",
        });
        this.newPersonModal = false;
        this.showPositionEditModal = false;
        this.getOrganizationPeopleList(this.selectedTeam);
        this.addPersonToPositionDynamic(employee.plans, employee.pernr);
      }
    });
  }

  addPositionModal() {
    this.addPositionModalShow = true;
  }

  createPosition() {
    var position = {
      ...this.newPositionData, 
      begda: this.createBegda ? new Date(this.createBegda).toISOString() : null,
      endda: this.createEndda ? new Date(this.createEndda).toISOString() : null, 
      orgeh: this.selectedTeam?.key || ''
    };
    return this.formService.createOrgEntity(position).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: "Başarılı",
          detail: "Pozisyon ekleme işlemi başarıyla gerçekleştirildi.",
        });
        this.addPositionModalShow = false;
        this.getOrganizationPeopleList(this.selectedTeam);
        this.newPositionData = {
          name: '',
          objid: '',
          begda: null,
          endda: null,
          orgeh: '',
          isSapkali: false
        };
        this.createBegda = null;
        this.createEndda = null;
      }
      else if (res.code == "400") {
        this.messageService.add({
          severity: "error",
          summary: "Hata",
          detail: "Pozisyon Ekleme İşlemi Gerçekleştirilemedi",
        });
      }
    });
  }

  deletePosition() {
    return this.formService.deleteOrgEntity({ objid: this.selectedEditPosition?.data?.split(" ")[1] }).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: "Başarılı",
          detail: "Pozisyon silme işlemi başarıyla gerçekleştirildi.",
        });
        this.showPositionEditModal = false;
        this.getOrganizationPeopleList(this.selectedTeam);
      }
    });
  }

  addPersonToPositionDynamic(positionId: any, personId: any) {
    return this.formService.addPersonToPosition(positionId, personId).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: "Başarılı",
          detail: "Pozisyona personel ekleme işlemi başarıyla gerçekleştirildi.",
        });
        this.getOrganizationPeopleList(this.selectedTeam);
        this.showPositionEditModal = false;
      }
    });
  }

  getExUserList() {
    this.userListEx = [];
    this.formService.exPersonList().subscribe((res: any) => {
      if (res.code == "200") {
        this.userListEx = res.response.map((r: any) => {
          return {
            id: r.pernr,
            name: r.name
          }
        })
      }
    })
  }

  addPositionExPersonModalShow() {
    this.exPersonModalShow = true;
    this.getExUserList();
  }

  addPersonToPositionEx() {
    return this.formService.addPersonToPosition(this.selectedEditPosition?.data?.split(" ")[1], this.selectedUserEx?.id).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: "Başarılı",
          detail: "Pozisyona personel ekleme işlemi başarıyla gerçekleştirildi.",
        });
        this.getOrganizationPeopleList(this.selectedTeam);
        this.showPositionEditModal = false;
        this.exPersonModalShow = false;
      }
    });
  }

  outOfPosition() {
    var employee: any = { ...(this.selectedOrganization || {}) };
    employee.plans = employee.orgeh; //İşten Ayrılma Kodu
    this.formService.updateEmployeeAssignment(employee).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: "Başarılı",
          detail: "Personel bağ koparma işlemi başarıyla gerçekleştirildi.",
        });
        this.getOrganizationPeopleList(this.selectedTeam);
        this.showEditModal = false;
      }
    })
  }

  getPeopleListByOrgeh(orgeh: any) {
    this.subUserList = [];
    this.formService.getPersonListByOrgeh(orgeh).subscribe((res: any) => {
      if (res.code == "200") {
        this.subUserList = res.response.map((r: any) => {
          return {
            id: r.pernr,
            name: r.pernr + " - " + r.name
          }
        })
      }
    })
  }
}