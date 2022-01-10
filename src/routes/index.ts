import { IResourceItem } from '@pankod/refine'
import { ResourceProps } from '@pankod/refine/dist/interfaces'
import DonationsPage from 'pages/DonationsPage/donations.page'
import CreateDonations from 'pages/DonationsPage/pages/create-donations/create-donations.page'
import EditDonation from 'pages/DonationsPage/pages/edit-donation/edit-donation.page'
import ViewDonation from 'pages/DonationsPage/pages/view-donation/view-donation.page'

interface IResource extends IResourceItem, ResourceProps {}

const allResources: IResource[] = [
  {
    name: 'donations',
    list: DonationsPage,
    canDelete: true,
    create: CreateDonations,
    edit: EditDonation,
    show: ViewDonation,
  },
]

export default allResources
