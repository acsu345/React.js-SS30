import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

interface Work {
    id: number,
    name: string,
    status: boolean,
}
export default function TodoList() {
     const [work, setWork] = useState<Work[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)
  const [newWork, setNewWork] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchWork = async () => {
    try {
      const res = await axios.get<Work[]>('http://localhost:8080/todolist')
      setWork(res.data)
    } catch (error) {
      console.error('Lỗi khi gọi API:', error)
    }
  }

  useEffect(() => {
    fetchWork()
  }, [])

  const handleDeleteClick = (item: Work) => {
    setSelectedWork(item)
    setShowModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedWork) return
    try {
      await axios.delete(`http://localhost:8080/todolist/${selectedWork.id}`)
      setShowModal(false)
      setSelectedWork(null)
      fetchWork()
    } catch (error) {
      console.error('Lỗi khi xóa công việc:', error)
    }
  }

  const handleAddWork = async () => {
    const name = newWork.trim()
    if (name === '') {
      alert('Tên công việc không được để trống!')
      return
    }

    const isDuplicate = work.some(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    )
    if (isDuplicate) {
      alert('Tên công việc đã tồn tại!')
      return
    }

    try {
      await axios.post('http://localhost:8080/todolist', {
        name,
        status: false
      })
      setNewWork('')
      inputRef.current?.focus()
      fetchWork()
    } catch (error) {
      console.error('Lỗi khi thêm công việc:', error)
    }
  }


  return (
    <div className="container py-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="text-center mb-4">Quản lý công việc</h3>

          <div className="mb-3 shadow-sm p-3 rounded">
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên công việc"
            />
           <button
              className="btn btn-primary mt-3 w-100"
              onClick={handleAddWork}
            >
              Thêm công việc
            </button>
          </div>

          <div className="d-flex justify-content-center mb-3 p-3 shadow-sm rounded">
            <div className="d-flex gap-2">
              <button className="btn btn-primary">Tất cả</button>
              <button className="btn btn-outline-primary">Hoàn thành</button>
              <button className="btn btn-outline-primary">Đang thực hiện</button>
            </div>
          </div>
          <ul
            className="list-group mb-3 p-3 shadow-sm rounded"
            style={{
              maxHeight: '300px',
              overflowY: work.length > 5 ? 'auto' : 'visible'
            }}
          >
            {work.slice(0, 5).map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    readOnly
                  />
                  {item.name}
                </div>
                <div>
                  <button className="btn btn-sm me-1">✏️</button>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleDeleteClick(item)}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between gap-2">
            <button className="btn btn-danger">Xóa công việc hoàn thành</button>
            <button className="btn btn-danger">Xóa tất cả công việc</button>
          </div>
        </div>
      </div>
      {showModal && selectedWork && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Bạn có chắc chắn muốn xóa công việc{' '}
                <strong>{selectedWork.name}</strong> không?
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
