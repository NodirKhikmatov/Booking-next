import { Box, Button, Pagination, Stack } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { useMutation, useQuery } from '@apollo/client';

import AgentCard from '../../libs/components/common/AgentCard';
import { GET_AGENTS } from '../../apollo/user/query';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { Member } from '../../libs/types/member/member';
import { Message } from '@mui/icons-material';
import { Messages } from '../../libs/config';
import { NextPage } from 'next';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('');
	const [sortingOpen, setSortingOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [agents, setAgents] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');
	const { t } = useTranslation('common');

	/** APOLLO REQUESTS **/

	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const {
		loading: getAgentsLoading,
		data: getAgentsData,
		error: getAgentsError,
		refetch: getAgentsRefetch,
	} = useQuery(GET_AGENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgents(data?.getAgents?.list);
			setTotal(data?.getAgents?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		// Set initial filter sort name based on current sort
		if (searchFilter.sort === 'createdAt' && searchFilter.direction === 'DESC') {
			setFilterSortName(t('recent'));
		} else if (searchFilter.sort === 'createdAt' && searchFilter.direction === 'ASC') {
			setFilterSortName(t('oldest'));
		} else if (searchFilter.sort === 'memberLikes') {
			setFilterSortName(t('likes'));
		} else if (searchFilter.sort === 'memberViews') {
			setFilterSortName(t('views'));
		} else {
			setFilterSortName(t('recent'));
		}
	}, [t, searchFilter.sort, searchFilter.direction]);

	useEffect(() => {
		if (router.query.input) {
			const input_obj = JSON.parse(router?.query?.input as string);
			setSearchFilter(input_obj);
		} else
			router.replace(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`);

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** HANDLERS **/
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
			case 'recent':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'DESC' });
				setFilterSortName(t('recent'));
				break;
			case 'old':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'ASC' });
				setFilterSortName(t('oldest'));
				break;
			case 'likes':
				setSearchFilter({ ...searchFilter, sort: 'memberLikes', direction: 'DESC' });
				setFilterSortName(t('likes'));
				break;
			case 'views':
				setSearchFilter({ ...searchFilter, sort: 'memberViews', direction: 'DESC' });
				setFilterSortName(t('views'));
				break;
		}
		setSortingOpen(false);
		setAnchorEl2(null);
	};

	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	const likeMemberHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			await likeTargetMember({
				variables: { input: id },
			});
			await getAgentsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert(t('success'), 800);
		} catch (err: any) {
			console.log('Error:likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <h1>{t('agentsPageMobile')}</h1>;
	} else {
		return (
			<Stack className={'agent-list-page'}>
				<Stack className={'container'}>
					<Stack className={'filter'}>
						<Box component={'div'} className={'left'}>
							<input
								type="text"
								placeholder={t('searchPlaceholder')}
								value={searchText}
								onChange={(e: any) => setSearchText(e.target.value)}
								onKeyDown={(event: any) => {
									if (event.key == 'Enter') {
										setSearchFilter({
											...searchFilter,
											search: { ...searchFilter.search, text: searchText },
										});
									}
								}}
							/>
						</Box>
						<Box component={'div'} className={'right'}>
							<span>{t('sortBy')}</span>
							<div>
								<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
									{filterSortName}
								</Button>
								<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
									<MenuItem onClick={sortingHandler} id={'recent'} disableRipple>
										{t('recent')}
									</MenuItem>
									<MenuItem onClick={sortingHandler} id={'old'} disableRipple>
										{t('oldest')}
									</MenuItem>
									<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
										{t('likes')}
									</MenuItem>
									<MenuItem onClick={sortingHandler} id={'views'} disableRipple>
										{t('views')}
									</MenuItem>
								</Menu>
							</div>
						</Box>
					</Stack>
					<Stack className={'card-wrap'}>
						{agents?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>{t('noAgentsFound')}</p>
							</div>
						) : (
							agents.map((agent: Member) => {
								return <AgentCard agent={agent} key={agent._id} likeMemberHandler={likeMemberHandler} />;
							})
						)}
					</Stack>
					<Stack className={'pagination'}>
						<Stack className="pagination-box">
							{agents.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
								<Stack className="pagination-box">
									<Pagination
										page={currentPage}
										count={Math.ceil(total / searchFilter.limit)}
										onChange={paginationChangeHandler}
										shape="circular"
										color="primary"
									/>
								</Stack>
							)}
						</Stack>

						{agents.length !== 0 && (
							<span>
								{t('total')} {total} {total === 1 ? t('agent') : t('agents')} {t('available')}
							</span>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

AgentList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(AgentList);
