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

  
  if(d.toString().length == 1) d = "0"+d.toString()
  if(m.toString().length == 1) m = "0"+m.toString()

  return `${Y}-${m}-${d}`
}

export const formatTime = date => {
  let newDate = new Date(date);
  let H = newDate.getHours();
  let i = newDate.getMinutes();
  let s = newDate.getSeconds();

  if (H.toString().length == 1) H = "0" + H.toString()
  if (i.toString().length == 1) i = "0" + i.toString()
  if (s.toString().length == 1) s = "0" + s.toString()

  return `${H}:${i}:${s}`
}

export const formatTime12Hours = date => {
  let newDate = new Date(date);
  let H = newDate.getHours();
  let i = newDate.getMinutes();

  let timeType = 'AM'

  if(H > 12) {
    H -= 12;
    timeType = 'PM'
  }

  if (H.toString().length == 1) H = "0" + H.toString()
  if (i.toString().length == 1) i = "0" + i.toString()

  return `${H}:${i} ${timeType}`
} 

export const formatDateTime = date => {
  return `${formatDate(date)} ${formatTime(date)}` ;
}