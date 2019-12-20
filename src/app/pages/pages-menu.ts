import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/SCM/dashboard',
    home: true,
  },
  {
    title: 'MPR',
    icon: 'keypad-outline',
    expanded: true,
    children: [
      {
        title: 'MPR Details',
        link: '/SCM/MPRDetails',
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
    title: 'Masters',
    icon: 'people-outline',
    expanded: true,
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
      }
      
    ],
    
    
  },

  {
    title: 'Auth',
    icon: 'lock-outline',
    expanded: true,
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
  
];
