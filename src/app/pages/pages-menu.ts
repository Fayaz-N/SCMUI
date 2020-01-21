import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/SCM/Dashboard',
    home: true,
  },
  {
    title: 'MPR',
    icon: 'keypad-outline',
    expanded: false,
    children: [
      {
        title: 'MPR Form',
        link: '/SCM/MPRForm',
        icon:'list-outline'
      },
      {
        title: 'MPR List',
        link: '/SCM/MPRList',
        icon:'list-outline'
      },
      {
        title: 'MPR Checker List',
        link: '/SCM/MPRCheckerList',
        icon:'checkmark-circle-2-outline'
      },
      {
        title: 'MPR Approver List',
        link: '/SCM/MPRApproverList',
        icon:'list-outline'
      }
      
    ],
    
    
  },
  {
    title: 'RFQ',
    icon: 'keypad-outline',
    expanded: false,
    children: [     
      {
        title: 'RFQ List',
        link: '/SCM/RFQList',
        icon: 'list-outline'
      }
    ],

  },

 
  {
    title: 'Masters',
    icon: 'people-outline',
    expanded: false,
    children: [
      {
        title: 'Approver',
        link: '/SCM/Approvers',
        icon:'person-done-outline'
      },
      {
        title: 'Buyer',
        link: '/SCM/Buyers',
        icon:'shopping-bag-outline'
      },
      {
        title: 'Department',
        link: '/SCM/Departments',
        icon:'list-outline'
      },
      {
        title: 'Scope',
        link: '/SCM/Scopes',
        icon:'list-outline'
      },
      {
        title: 'Procurement Source',
        link: '/SCM/ProcurementSource',
        icon:'list-outline'
      },
      {
        title: 'Project Manager',
        link: '/SCM/ProjectManager',
        icon: 'list-outline'
      }
      
    ],
    
    
  },

  {
    title: 'Auth',
    icon: 'lock-outline',
    expanded: false,
    children: [
      {
        title: 'Access Group',
        link: '/SCM/Configuration',
        icon:'layers-outline'
      },
      {
        title: 'Access Name',
        link: '/SCM/Groupaccessibility',
        icon:'layers-outline'
      },
      {
        title: 'Authorization Group',
        link: '/SCM/Roleaccessibility',
        icon:'people-outline'
      },
      {
        title: 'Authorization Item',
        link: '/SCM/Authorizationitem',
        icon:'layers-outline'
      }
      
    ],
    
    
  },
    {
        title: 'Purchase Authorization',
        icon: 'lock-outline',
        expanded: false,
        children: [
            {
                title: 'MPRPA',
                link: '/SCM/mprpa',
                icon: 'layers-outline'
            },
            {
                title: 'PA Details',
                link: '/SCM/PADetails',
                icon: 'layers-outline'
            },
            {
                title: 'Employee Configuration',
                link: '/SCM/EmployeeConfiguration',
                icon: 'layers-outline'
            },
            {
                title: 'CreditDays',
                link: '/SCM/CreditDays',
                icon: 'layers-outline'
            },
            {
                title: 'MPRPAList',
                link: '/SCM/MPRPAList',
                icon: 'layers-outline'
            },
            {
                title: 'MprApprovers',
                link: '/SCM/MPRPAApproverList',
                icon: 'layers-outline'
            }
        ],
    },
];
