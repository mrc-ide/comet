import { shallowMount } from '@vue/test-utils';
import About from '@/views/About.vue';

describe('About.vue', () => {
  it('renders props.msg when passed', () => {
    const heading = 'new message';
    const wrapper = shallowMount(About, {
      props: { heading },
    });
    expect(wrapper.text()).toMatch(heading);
  });
});
