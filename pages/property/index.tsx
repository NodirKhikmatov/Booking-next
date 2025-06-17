import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import { Direction, Message } from '../../libs/enums/common.enum';
import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { useMutation, useQuery } from '@apollo/client';

import Filter from '../../libs/components/property/Filter';
import { GET_PROPERTIES } from '../../apollo/user/query';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { NextPage } from 'next';
import { PropertiesInquiry } from '../../libs/types/property/property.input';
import { Property } from '../../libs/types/property/property';
import PropertyCard from '../../libs/components/property/PropertyCard';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';

// Fix 1: Make sure getStaticProps is correctly exported and handles all locales
export const getStaticProps = async ({ locale }: { locale: string }) => {
	try {
		return {
			props: {
				...(await serverSideTranslations(locale || 'en', ['common'])),
			},
		};
	} catch (error) {
		console.error('Translation loading error:', error);
		return {
			props: {
				...(await serverSideTranslations('en', ['common'])),
			},
		};
	}
};

const PropertyList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();

	// Fix 2: Add fallback for translation hook
	const { t, i18n } = useTranslation('common');

	// Fix 3: Add debug logging to check if translations are loaded
	useEffect(() => {
		console.log('Current language:', i18n.language);
		console.log('Translation ready:', i18n.isInitialized);
		console.log('Sample translation test:', t('Sort by'));
	}, [i18n.language, i18n.isInitialized, t]);

	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [properties, setProperties] = useState<Property[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProperties(data?.getProperties?.list);
			setTotal(data?.getProperties?.metaCounter[0]?.total);
		},
	});

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProperty({
				variables: { input: id },
			});
			await getPropertiesRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Error:likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}
		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		getPropertiesRefetch({ input: searchFilter }).then();
	}, [searchFilter]);

	// Fix 4: Update filterSortName when language changes
	useEffect(() => {
		if (i18n.isInitialized) {
			setFilterSortName(t('New'));
		}
	}, [i18n.language, i18n.isInitialized, t]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/property?input=${JSON.stringify(searchFilter)}`,
			`/property?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName(t('New')); // Fix 5: Use translation here
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'propertyPrice', direction: Direction.ASC });
				setFilterSortName(t('Lowest Price')); // Fix 5: Use translation here
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'propertyPrice', direction: Direction.DESC });
				setFilterSortName(t('Highest Price')); // Fix 5: Use translation here
				break;
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	// Fix 6: Add loading state while translations are loading
	if (!i18n.isInitialized) {
		return <div>Loading translations...</div>;
	}

	if (device === 'mobile') {
		return <h1>PROPERTIES MOBILE</h1>;
	} else {
		return (
			<div id="property-list-page" style={{ position: 'relative' }}>
				<div className="container">
					<Box component={'div'} className={'right'}>
						<span>{t('Sort by')}</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{filterSortName}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem
									onClick={sortingHandler}
									id={'new'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									{t('New')}
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'lowest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									{t('Lowest Price')}
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'highest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									{t('Highest Price')}
								</MenuItem>
							</Menu>
						</div>
					</Box>
					<Stack className={'property-page'}>
						<Stack className={'filter-config'}>
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{properties?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>{t('No Properties found!')}</p> {/* Fix 7: Translate this text */}
									</div>
								) : (
									properties.map((property: Property) => {
										return (
											<PropertyCard property={property} likePropertyHandler={likePropertyHandler} key={property?._id} />
										);
									})
								)}
							</Stack>
							<Stack className="pagination-config">
								{properties.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{properties.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											{/* Fix 8: Translate the total results text */}
											{t('Total {{count}} propert{{plural}} available', {
												count: total,
												plural: total > 1 ? 'ies' : 'y',
											})}
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

PropertyList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			squaresRange: {
				start: 0,
				end: 500,
			},
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(PropertyList);
