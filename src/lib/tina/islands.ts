// @ts-nocheck (generated types/client appear after your first tinacms dev run)
import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import type { PageQuery, PostQuery } from '../../../tina/__generated__/types';
import Contact from '../../components/Contact.astro';
import Footer from '../../components/Footer.astro';
import Gallery from '../../components/Gallery.astro';
import Hero from '../../components/Hero.astro';
import Navbar from '../../components/Navbar.astro';
import Services from '../../components/Services.astro';
import PostBody from '../../components/tina/PostBody.astro';
import { getPage, getPost } from './data';

const homePageIsland = (component: unknown) => ({
  fetch: () => getPage('home'),
  component,
  wrapper: { tag: 'div' },
  propsFromData: (data: unknown) => ({
    data: (data as QueryResult<PageQuery>).data?.page,
  }),
});

export const islands: IslandRegistry = {
  homeNavbar: homePageIsland(Navbar),
  homeHero: homePageIsland(Hero),
  homeServices: homePageIsland(Services),
  homeGallery: homePageIsland(Gallery),
  homeContact: homePageIsland(Contact),
  homeFooter: homePageIsland(Footer),
  post: {
    fetch: (_request, params) => getPost(params.get('slug') ?? 'hello-world'),
    component: PostBody,
    wrapper: { tag: 'article' },
    propsFromData: (data) => ({
      data: (data as QueryResult<PostQuery>).data?.post,
    }),
  },
};
