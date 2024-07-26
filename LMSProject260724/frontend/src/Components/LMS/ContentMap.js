import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Dropdown, Form } from 'react-bootstrap'; // Ensure Table and Dropdown are imported here
import { Row, Col } from 'react-bootstrap';

import FormContent from './FormContent'
import { getcoursecontentApi } from '../../api/endpoints';
import '../global.css'



const ContentMap = () => {
   // const [showModal, setShowModal] = useState(false);
    const [testcontents, setTestcontents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [contents, setContents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('All');
    const [selectedContent, setSelectedContent] = useState('All');
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('All');
    const [subTopics, setSubTopics] = useState([]);
    const [selectedSubTopic, setSelectedSubTopic] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

   // const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        getcontents();
    }, []);

    const getcontents = () => {
        getcoursecontentApi()
            .then(data => {
                setTestcontents(data);
                const contentList = Array.from(new Set(data.map(content => content.content_name)));
                setContents(['All', ...contentList]);
                const courseList = Array.from(new Set(data.map(content => content.course_id)));
                setCourses(['All', ...courseList]);
                const topicList = Array.from(new Set(data.map(content => content.topic)));
                setTopics(['All', ...topicList]);
                const subTopicList = Array.from(new Set(data.map(content => content.sub_topic)));
                setSubTopics(['All', ...subTopicList]);
            })
            .catch(error => console.error('Error fetching test contents:', error));
    };

    const handleContentChange = (content) => {
        setSelectedContent(content);
    };

    const handleCourseChange = (course) => {
        setSelectedCourse(course);
    };

    const handleTopicChange = (topic) => {
        setSelectedTopic(topic);
    };

    const handleSubTopicChange = (subTopic) => {
        setSelectedSubTopic(subTopic);
    };



    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };




    return (
        <div>
            <div >
                <div className="header"> <h4>Map  Content </h4></div>
                <br></br>
            <FormContent />
            </div>
           
            <br /><br />
            <div className="div-search">
                    
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearch}
                       className="search"
                       style={{width:"250px"}}
                    />
                </div>
            <div className="table-responsive" >
                <Table striped bordered hover className='table-container'>
                    <thead>
                        <tr>
                            <th>
                                <div>
                                    Content Name
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="course-dropdown">
                                            {selectedContent}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                                            {contents.map(content => (
                                                <Dropdown.Item key={content} onClick={() => handleContentChange(content)}>
                                                    {content === 'All' ? 'All Courses' : content}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </th>
                            {/*}    <th>Content_Id</th> */}
                            <th>
                                <div>
                                    Course
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="course-dropdown">
                                            {selectedCourse}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                                            {courses.map(course => (
                                                <Dropdown.Item key={course} onClick={() => handleCourseChange(course)}>
                                                    {course === 'All' ? 'All Courses' : course}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </th>
                            <th>
                                <div>
                                    Topic
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="topic-dropdown">
                                            {selectedTopic}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                                            {topics.map(topic => (
                                                <Dropdown.Item key={topic} onClick={() => handleTopicChange(topic)}>
                                                    {topic === 'All' ? 'All Topics' : topic}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </th>
                            <th>
                                <div>
                                    Sub Topic
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="subtopic-dropdown">
                                            {selectedSubTopic}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
                                            {subTopics.map(subTopic => (
                                                <Dropdown.Item key={subTopic} onClick={() => handleSubTopicChange(subTopic)}>
                                                    {subTopic === 'All' ? 'All Sub Topics' : subTopic}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {testcontents
                            .filter(content => (selectedCourse === 'All' || content.course_id === selectedCourse) &&
                                (selectedTopic === 'All' || content.topic === selectedTopic) &&
                                (selectedSubTopic === 'All' || content.sub_topic === selectedSubTopic))
                            .filter(content => !searchQuery || (content.course_id && content.course_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (content.topic && content.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (content.sub_topic && content.sub_topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (content.content_name && content.content_name.toLowerCase().includes(searchQuery.toLowerCase()))
                            )

                            .map(content => (
                                <tr key={content.id}>
                                    <td>{content.content_name}</td>
                                    <td>{content.course_id}</td>
                                    <td>{content.topic}</td>
                                    <td>{content.sub_topic}</td>
                                </tr>
                            ))}
                    </tbody>
                </Table></div>
        </div>
    );
};

export default ContentMap;