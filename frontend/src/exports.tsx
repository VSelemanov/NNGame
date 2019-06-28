import { updateOneState } from './actions';

export const mapStateToProps = (store: any) => {
  return {
    state: store,
  };
};

export const mapDispatchToProps = (dispatch: any) => ({
  updateOneState: (nameState: string, param: any) => dispatch(updateOneState(nameState, param)),
});
