import {Toast} from 'native-base';
import AxiosErrors from './request/AxiosErrors';

export const camelToSnakeCase = str =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const redirectResetTo = (props, nameNavigation) => {
  props.navigation.reset({index: 1, routes: [{name: nameNavigation}]});
};

export const redirectResetToLogin = props => {
  return redirectResetTo(props, 'LoginScreen');
};

export const handleErrors = (screen, error) => {
  if (error.status == 422) {
    screen.setState({
      invalidate: AxiosErrors.copyErrorsToStringObject(
        error,
        screen.state.invalidate,
      ),
    });
  } else if (error.state == 401) {
    redirectResetToLogin(screen.props);
  }
  Toast.show({
    text: error.message,
    type: 'danger',
  });
};

export const formatRupiah = money => {
  var number_string = money.toString(),
    split = number_string.split(','),
    leftovers  = split[0].length % 3,
    rupiah = split[0].substr(0, leftovers ),
    thousand = split[0].substr(leftovers ).match(/\d{1,3}/gi);

  if (thousand) {
    let separator = leftovers  ? '.' : '';
    rupiah += separator + thousand.join('.');
  }
  rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;

  return rupiah;
};


export const formatDate = date => {
  let newDate = new Date(date);
  let d = newDate.getDate()
  let m = newDate.getMonth() + 1
  let Y = newDate.getFullYear()

  if(d.length < 2) d = "0"+d
  if(m.length < 2) m = "0"+m
  
  return `${Y}-${m}-${d}`
}