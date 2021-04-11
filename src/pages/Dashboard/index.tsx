import { useEffect, useState } from 'react';

import api from '../../services/api';
import { FoodResponse, FoodData } from '../../types';

import Header from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export const Dashboard = (): JSX.Element =>{
  const [foods, setFoods] = useState<FoodResponse[]>([])
  const [editingFood, setEditingFood] = useState({} as FoodResponse)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handleAddFood = async (food: FoodData) => {
    try {
      const response = await api.post<FoodResponse>('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food:FoodResponse) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered)
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const  toggleEditModal = () => {
    setEditModalOpen(!editModalOpen)

  }

  const handleEditFood = (food:FoodResponse) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');
  
      setFoods(response.data);
    }
    loadFoods()
  }, [])

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}

// class OldDashboard extends Component {
//   constructor(props) {
//     super(props);
//     state = {
//       foods: [],
//       editingFood: {},
//       modalOpen: false,
//       editModalOpen: false,
//     }
//   }

//   async componentDidMount() {
//     const response = await api.get('/foods');

//     setState({ foods: response.data });
//   }

//   handleAddFood = async food => {
//     const { foods } = state;

//     try {
//       const response = await api.post('/foods', {
//         ...food,
//         available: true,
//       });

//       setState({ foods: [...foods, response.data] });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   handleUpdateFood = async food => {
//     const { foods, editingFood } = state;

//     try {
//       const foodUpdated = await api.put(
//         `/foods/${editingFood.id}`,
//         { ...editingFood, ...food },
//       );

//       const foodsUpdated = foods.map(f =>
//         f.id !== foodUpdated.data.id ? f : foodUpdated.data,
//       );

//       setState({ foods: foodsUpdated });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   handleDeleteFood = async id => {
//     const { foods } = state;

//     await api.delete(`/foods/${id}`);

//     const foodsFiltered = foods.filter(food => food.id !== id);

//     setState({ foods: foodsFiltered });
//   }

//   toggleModal = () => {
//     const { modalOpen } = state;

//     setState({ modalOpen: !modalOpen });
//   }

//   toggleEditModal = () => {
//     const { editModalOpen } = state;

//     setState({ editModalOpen: !editModalOpen });
//   }

//   handleEditFood = food => {
//     setState({ editingFood: food, editModalOpen: true });
//   }

//   render() {
//     const { modalOpen, editModalOpen, editingFood, foods } = state;

//     return (
//       <>
//         <Header openModal={toggleModal} />
//         <ModalAddFood
//           isOpen={modalOpen}
//           setIsOpen={toggleModal}
//           handleAddFood={handleAddFood}
//         />
//         <ModalEditFood
//           isOpen={editModalOpen}
//           setIsOpen={toggleEditModal}
//           editingFood={editingFood}
//           handleUpdateFood={handleUpdateFood}
//         />

//         <FoodsContainer data-testid="foods-list">
//           {foods &&
//             foods.map(food => (
//               <Food
//                 key={food.id}
//                 food={food}
//                 handleDelete={handleDeleteFood}
//                 handleEditFood={handleEditFood}
//               />
//             ))}
//         </FoodsContainer>
//       </>
//     );
//   }
// };

// export default OldDashboard;