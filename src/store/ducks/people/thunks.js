import { Creators as people } from './index'
import {getPeople} from '../../../services'

const {
  get,
  search,
  loading,
  fail,
  failSearch
} = people


export function setSearch(string){
  return (dispatch, getState) => {
    const {missingPeople} = getState()

    if (!string) {
      return dispatch(search([]))
    }

    const searched = missingPeople.people.filter(
      ({fullName}) => (fullName.toLowerCase().indexOf(string.toLowerCase() || '') >= 0)
    )

    if(string && !searched.length){
      return dispatch(failSearch())
    }


    return dispatch(search(searched))
  }
}


export function getMissingPeople() {
  return async (dispatch) => {

    dispatch(loading())

    const people = await getPeople().then(e => e)

    const formatedDate = people.map(({description, height, gender, age, ...rest} ) => ({
      ...rest,
      id: `${rest.first_name}-${rest.last_name}`,
      fullName: `${rest.first_name} ${rest.last_name}`,
      description: {
        description,
        height,
        gender,
        age,
        picture: `https://i.pravatar.cc/360?u=${rest.umid}`
      }
    }))

    dispatch(get(formatedDate))
  }
}
