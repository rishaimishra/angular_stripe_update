import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class GlobalConstantService {

	constructor(
	) { }

	BASE_URL: string = environment.base_url;
	API_URL: string = environment.api_url;
	public paypal: any = environment.paypalCredentials.sandbox;
	public sxl: any = environment.sxlCredential;

	public apiModules: any = {
		country: {
			url: environment.api_url + '/utility/location/countries',
			methods: [
				{ name: 'list', type: 'get', url: '' }
			]
		},
		state: {
			url: environment.api_url + '/utility/location/states',
			methods: [
				{ name: 'details', type: 'get', url: '' }
			]
		},
		city: {
			url: environment.api_url + '/utility/location/cities',
			methods: [
				{ name: 'details', type: 'get', url: '' }
			]
		},
		couponVerify: {
			url: environment.api_url + '/utility/coupon/verify',
			methods: [
				{ name: 'create', type: 'post', url: '' }
			]
		},
		createVendorWallet: {
			url: environment.api_url + '/utility/create-vendor-wallet',
			methods: [
				{ name: 'details', type: 'get', url: '' }
			]
		},
		defaultAddress: {
			url: environment.api_url + '/utility/order-address/default',
			methods: [
				{ name: 'create', type: 'post', url: '' }
			]
		},
		payoutApproved: {
			url: environment.api_url + '/utility/payout/approved',
			methods: [
				{ name: 'create', type: 'post', url: '' }
			]
		},
		paymentType: {
			url: environment.api_url + '/utility/payment-type',
			methods: [
				{ name: 'list', type: 'get', url: '' }
			]
		},
		productPrice: {
			url: environment.api_url + '/utility/product-prices',
			methods: [
				{ name: 'create', type: 'post', url: '' },
			]
		},
		priceDelete: {
			url: environment.api_url + '/utility/price/delete/products',
			methods: [
				{ name: 'details', type: 'get', url: '' },
			]
		},
		payment: {
			url: environment.api_url + '/payment/order-payment-details',
			methods: [
				{ name: 'create', type: 'post', url: '' },
			]
		},
		paymentUpdate: {
			url: environment.api_url + '/payment/order-status-update',
			methods: [
				{ name: 'update', type: 'put', url: '' },
			]
		},

		paymentCyberSource: {
			url: environment.api_url + '/payment/paycs',
			methods: [
				{ name: 'create', type: 'post', url: '' }
			]
		},
		orderSXLUpdate: {
			url: environment.api_url + '/utility/sxl-payment-address',
			methods: [
				{ name: 'create', type: 'post', url: '' },
			]
		},
		paymentSXL: {
			url: environment.api_url + '/payment',
			methods: [
				{ name: 'create', type: 'post', url: '/sxl-address-generate' },
				{ name: 'details', type: 'get', url: '/sxl-address-check' },
			]
		},
		// paymentSXLCheck: {
		// 	url: environment.api_url + '/auth/sxl-address-check',
		// 	methods: [
		// 		{ name: 'details', type: 'get', url: '' },
		// 	]
		// },
		paymentWallet: {
			url: environment.api_url + '/payment/wallet',
			methods: [
				{ name: 'create', type: 'post', url: '' }
			]
		},
		pageSlider: {
			url: environment.api_url + '/page-slider',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		address: {
			url: environment.api_url + '/order-address',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		user: {
			url: environment.api_url + '/user',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		product: {
			url: environment.api_url + '/product',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		category: {
			url: environment.api_url + '/category',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		event: {
			url: environment.api_url + '/event',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		course: {
			url: environment.api_url + '/course',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		orders: {
			url: environment.api_url + '/orders',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		ratings: {
			url: environment.api_url + '/ratings',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		reviews: {
			url: environment.api_url + '/reviews',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		orderDetails: {
			url: environment.api_url + '/order-details',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		wishlist: {
			url: environment.api_url + '/wishlist',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		courseUser: {
			url: environment.api_url + '/course-user',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		wallet: {
			url: environment.api_url + '/wallets',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		walletTransactions: {
			url: environment.api_url + '/wallet-transactions',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		payoutTransactions: {
			url: environment.api_url + '/payout',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		resellerProduct: {
			url: environment.api_url + '/reseller-product',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		announcements: {
			url: environment.api_url + '/announcement',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		resellerProductDelete: {
			url: environment.api_url + '/utility/reseller-product-soft-delete',
			methods: [
				{ name: 'create', type: 'post', url: '' }
			]
		},
		resellerProductApproved: {
			url: environment.api_url + '/utility/reseller-product-approved',
			methods: [
				{ name: 'create', type: 'post', url: '' }
			]
		},
		bankDetails: {
			url: environment.api_url + '/user-bank-information',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		notifications: {
			url: environment.api_url + '/notification',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '/list' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		roles: {
			url: environment.api_url + '/role',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		ourTeam: {
			url: environment.api_url + '/our-team',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		coursePromotion: {
			url: environment.api_url + '/course-promotions',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},

		tutorAggrement: {
			url: environment.api_url + '/utility/vendor-agreement',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		paymentCategory: {
			url: environment.api_url + '/payment-category',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},

		payTypeCheck: {
			url: environment.api_url + '/payment/paytypecheck',
			methods: [
				{ name: 'create', type: 'post', url: '' },
			]
		},

		settings: {
			url: environment.api_url + '/utility/settings',
			methods: [
				{ name: 'list', type: 'get', url: '' },
			]
		},
		paymentFailedWcs:{
			url: environment.api_url + '/payment/failed/wcs',
			methods: [
				{ name: 'create', type: 'post', url: '' },
			]
		},
		speaker: {
			url: environment.api_url + '/event-speakers',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		video: {
			url: environment.api_url + '/video',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},

		eventCountry: {
			url: environment.api_url + '/utility/country-list/events',
			methods: [
				{ name: 'list', type: 'get', url: '' },
			]
		},
		productLeftPanel: {
			url: environment.api_url + '/utility/product-left-panel',
			methods: [
				{ name: 'update', type: 'put', url: '' },
			]
		},
		commissionReport: {
			url: environment.api_url + '/utility/commission-report',
			methods: [
				{ name: 'list', type: 'get', url: '' }
			]
		},
		brands: {
			url: environment.api_url + '/brands',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},

		siteSettings: {
			url: environment.api_url + '/site-setting',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},

		salesReport: {
			url: environment.api_url + '/utility/sales-report',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},

		supportTicket: {
			url: environment.api_url + '/ticket',
			methods: [
				{ name: 'create', type: 'post', url: '/create-ticket' },
				{ name: 'update', type: 'put', url: '/update' },
				{ name: 'list', type: 'get', url: '/view-all-ticket' },
				{ name: 'details', type: 'get', url: '/details' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},

		supportTicketConversation: {
			url: environment.api_url + '/ticket/conversation',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		ticketReply: {
			url: environment.api_url + '/ticket/reply',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},
		supportTicketSearch:{
			url: environment.api_url + '/ticket/search',
			methods: [
				{ name: 'create', type: 'post', url: '' },
				{ name: 'update', type: 'put', url: '' },
				{ name: 'list', type: 'get', url: '' },
				{ name: 'details', type: 'get', url: '' },
				{ name: 'delete', type: 'delete', url: '' }
			]
		},



	};
}
