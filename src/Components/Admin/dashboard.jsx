import React from 'react'
import { useContext, useState, useEffect } from 'react'
import AppContext from '../../Context/appContext';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useRef } from 'react'
import DestinationList from './destination copy 2'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import AdminRooms from './adminRooms'

const Dashboard = ({ theArr, anotherArr }) => {
    const context = useContext(AppContext)
    const { allPackageData, setErrorModal,modalErrorText, errorModal,handleCreateRental, setCoverImages, editImages, setImageLoader, selectedImage, setSelectedImage, modalRef, adminToken, setAdminToken, siteData, setSiteData, editSiteInfo, editLoader, coverImages, cloudinary } = context
    const history = useHistory()
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (showSuccessModal) {
            const timer = setTimeout(() => setShowSuccessModal(false), 3000);
            return () => clearTimeout(timer);
        }
       
    }, [showSuccessModal]);


useEffect(() => {
  if (errorModal) {
    setShowSuccessModal(false);  // turn off success modal if error happens
  }
}, [errorModal]);

    // Clear error message after 5 seconds
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const [uploading, setUploading] = useState(false);

    const Spinner = ({ color = "primary", size = 25 }) => (
        <div style={{ width: `${size}px`, height: `${size}px` }} className={`spinner-border text-${color} mx-2`} role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    );

    const uploadImageToCloudinary = async (file) => {
        const url = "https://api.cloudinary.com/v1_1/dextrzp2q/image/upload";
        const uploadPreset = "dga8po59";

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const res = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();

        if (!data.secure_url) {
            throw new Error("Upload failed");
        }

        return data.secure_url;
    };

    const [currentState, setCurrentState] = useState("Basic")
    const [paymentState, setPaymentState] = useState("Cheque")

    // Form data state
    const [form, setform] = useState({
        user: '',
        cnic: '',
        reference: '',
        carNumber: '',
        fuelAmount: '',
        carMileage: '',
        location: '',
        payment: {
            mode: 'Cheque',
            cheque: {
                chequeNumber: '',
                chequePicture: '',
                paymentAmount: '',
                bankName: ''
            },
            online: {
                paymentAmount: '',
                bankName: ''
            },
            cash: {
                paymentAmount: ''
            }
        },
        attachments: {
            selfiePicture: '',
            carPicture: '',
            cnicCopy: '',
            receiptImage: ''
        },
        carDetails: {
            wheelCaps: { present: false, remarks: '' },
            footmats: { present: false, remarks: '' },
            airpress: { present: false, remarks: '' },
            cleaningCloth: { present: false, remarks: '' },
            airConditioner: { present: false, remarks: '' },
            lights: { present: false, remarks: '' },
            jackRod: { present: false, remarks: '' },
            spanner: { present: false, remarks: '' },
            stepny: { present: false, remarks: '' },
        }
    })

    const fileInputRef = useRef(null);

    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    const [imageForUpload, setImageForUpload] = useState(null)

    const previewPhoto = (theimage) => {
        const anotherImage = URL.createObjectURL(theimage)
        console.log(anotherImage);
        setSelectedImage(anotherImage)
        setImageForUpload(theimage)
    }

    const excludeImage = (index) => {
        const newArr = coverImages.filter((e, i) => { return i !== index })
        setCoverImages(newArr)
    }

    // Handle input changes
    const handleInputChange = (field, value) => {
        setform(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handlePaymentChange = (field, value) => {
        setform(prev => ({
            ...prev,
            payment: {
                ...prev.payment,
                [paymentState.toLowerCase()]: {
                    ...prev.payment[paymentState.toLowerCase()],
                    [field]: value
                }
            }
        }))
    }

    const uploadAttachmentImage = async (type, file) => {
        setUploading(true);
        try {
            const imageUrl = await uploadImageToCloudinary(file);

            setform((prevForm) => ({
                ...prevForm,
                attachments: {
                    ...prevForm.attachments,
                    [type]: imageUrl,
                },
            }));

            console.log(`${type} uploaded:`, imageUrl);
        } catch (err) {
            console.error("Failed to upload:", err);
            setErrorMessage("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleAttachmentChange = (field, file) => {
        setform(prev => ({
            ...prev,
            attachments: {
                ...prev.attachments,
                [field]: file
            }
        }))
    }

    const handleCarDetailChange = (detail, field, value) => {
        setform(prev => ({
            ...prev,
            carDetails: {
                ...prev.carDetails,
                [detail]: {
                    ...prev.carDetails[detail],
                    [field]: value
                }
            }
        }))
    }

    const handlePaymentModeChange = (mode) => {
        setPaymentState(mode)
        setform(prev => ({
            ...prev,
            payment: {
                ...prev.payment,
                mode: mode
            }
        }))
    }

    const uploadChequeImage = async (file) => {
        setUploading(true);
        try {
            const imageUrl = await uploadImageToCloudinary(file);

            setform((prevForm) => ({
                ...prevForm,
                payment: {
                    ...prevForm.payment,
                    cheque: {
                        ...prevForm.payment.cheque,
                        chequePicture: imageUrl,
                    },
                },
            }));

            console.log(`Cheque image uploaded:`, imageUrl);
        } catch (err) {
            console.error("Cheque Upload Failed:", err);
            setErrorMessage("Failed to upload cheque image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const [firstdndElement, setfirstdndElement] = useState({ element: null, index: null })
    const [seconddndElement, setseconddndElement] = useState({ element: null, index: null })

    const changeOrder = () => {
        coverImages.splice(firstdndElement.index, 1, seconddndElement.element)
        coverImages.splice(seconddndElement.index, 1, firstdndElement.element)
        setCoverImages([...coverImages])
    }

    console.log(firstdndElement)
    console.log(seconddndElement)

    useEffect(() => {
        console.log("This is form", form)
    }, [form]);

    return (
        <div>
            <div className='container my-5'>
                {/* <nav className="nav nav-pills nav-fill">
                    <a className={`nav-link ${currentState == "Basic" && 'active'}`} onClick={() => setCurrentState("Basic")} aria-current="page">Rent Car</a>
                    <a className={`nav-link ${currentState == "Cover" && 'active'}`} onClick={() => setCurrentState("Cover")}>All Car Rents</a>
                    <a className={`nav-link ${currentState == "Room" && 'active'}`} onClick={() => setCurrentState("Room")}>Room Settings</a>
                </nav> */}
                <h1 className=''>Rent A Car</h1>

                {/* Error Message Display */}
                {errorMessage && (
                    <div className="alert alert-danger my-3" role="alert">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {errorMessage}
                        <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
                    </div>
                )}

                {currentState == "Basic" && <div className='my-3'>
                    <form autoComplete="on">
                        <div className="mb-3">
                            <label htmlFor="cnicInput" className="form-label py-2">CNIC</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="cnicInput"
                                name="cnic"
                                autoComplete="off"
                                value={form.cnic}
                                onChange={(e) => handleInputChange('cnic', e.target.value)}
                                aria-describedby="cnicHelp" 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="referenceInput" className="form-label py-2">Reference</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="referenceInput"
                                name="reference"
                                autoComplete="name"
                                value={form.reference}
                                onChange={(e) => handleInputChange('reference', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="carNumberInput" className="form-label py-2">Car Number</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="carNumberInput"
                                name="carNumber"
                                autoComplete="off"
                                value={form.carNumber}
                                onChange={(e) => handleInputChange('carNumber', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fuelAmountInput" className="form-label py-2">Fuel Amount</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="fuelAmountInput"
                                name="fuelAmount"
                                autoComplete="off"
                                value={form.fuelAmount}
                                onChange={(e) => handleInputChange('fuelAmount', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="carMileageInput" className="form-label py-2">Car Mileage</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="carMileageInput"
                                name="carMileage"
                                autoComplete="off"
                                value={form.carMileage}
                                onChange={(e) => handleInputChange('carMileage', e.target.value)}
                            />
                        </div>

                        <label className="form-label py-2">Location</label>
                        <div className="d-flex">
                            <div className="p-2 border border-secondary border-1 rounded-3 mx-2">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="location" 
                                        id="withinCity" 
                                        checked={form.location === 'Within City'}
                                        onChange={() => handleInputChange('location', 'Within City')}
                                    />
                                    <label className="form-check-label" htmlFor="withinCity">
                                        Within City
                                    </label>
                                </div>
                            </div>
                            <div className="p-2 border border-secondary border-1 rounded-3 mx-2">
                                <div className="form-check">
                                    <input 
                                        className="form-check-input" 
                                        type="radio" 
                                        name="location" 
                                        id="outOfCity" 
                                        checked={form.location === 'Out Of City'}
                                        onChange={() => handleInputChange('location', 'Out Of City')}
                                    />
                                    <label className="form-check-label" htmlFor="outOfCity">
                                        Out Of City
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className='py-4'>
                            <h1>Payment Mode</h1>
                            <nav className="nav nav-pills nav-fill">
                                <a className={`nav-link ${paymentState == "Cheque" && 'active'}`} onClick={() => handlePaymentModeChange("Cheque")} aria-current="page">Cheque</a>
                                <a className={`nav-link ${paymentState == "Online" && 'active'}`} onClick={() => handlePaymentModeChange("Online")}>Online Payment</a>
                                <a className={`nav-link ${paymentState == "Cash" && 'active'}`} onClick={() => handlePaymentModeChange("Cash")}>Cash Payment</a>
                            </nav>

                            {paymentState == "Cheque" && <div>
                                <div className="mb-3">
                                    <label htmlFor="chequeNumberInput" className="form-label py-2">Cheque Number</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="chequeNumberInput"
                                        name="chequeNumber"
                                        autoComplete="off"
                                        value={form.payment.cheque.chequeNumber}
                                        onChange={(e) => handlePaymentChange('chequeNumber', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="chequePictureInput" className="form-label py-2">Cheque Picture</label>
                                    <input 
                                        className="form-control" 
                                        type="file" 
                                        id="chequePictureInput"
                                        name="chequePicture"
                                        disabled={uploading}
                                        onChange={(e) => uploadChequeImage(e.target.files[0])}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="chequePaymentAmountInput" className="form-label py-2">Payment Amount</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="chequePaymentAmountInput"
                                        name="chequePaymentAmount"
                                        autoComplete="off"
                                        value={form.payment.cheque.paymentAmount}
                                        onChange={(e) => handlePaymentChange('paymentAmount', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="chequeBankNameInput" className="form-label py-2">Bank Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="chequeBankNameInput"
                                        name="chequeBankName"
                                        autoComplete="organization"
                                        value={form.payment.cheque.bankName}
                                        onChange={(e) => handlePaymentChange('bankName', e.target.value)}
                                    />
                                </div>
                            </div>}

                            {paymentState == "Online" && <div>
                                <div className="mb-3">
                                    <label htmlFor="onlinePaymentAmountInput" className="form-label py-2">Payment Amount</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="onlinePaymentAmountInput"
                                        name="onlinePaymentAmount"
                                        autoComplete="off"
                                        value={form.payment.online.paymentAmount}
                                        onChange={(e) => handlePaymentChange('paymentAmount', e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="onlineBankNameInput" className="form-label py-2">Bank Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="onlineBankNameInput"
                                        name="onlineBankName"
                                        autoComplete="organization"
                                        value={form.payment.online.bankName}
                                        onChange={(e) => handlePaymentChange('bankName', e.target.value)}
                                    />
                                </div>
                            </div>}

                            {paymentState == "Cash" && <div>
                                <div className="mb-3">
                                    <label htmlFor="cashPaymentAmountInput" className="form-label py-2">Payment Amount</label>
                                    <input 
                                        type="number" 
                                        className="form-control" 
                                        id="cashPaymentAmountInput"
                                        name="cashPaymentAmount"
                                        autoComplete="off"
                                        value={form.payment.cash.paymentAmount}
                                        onChange={(e) => handlePaymentChange('paymentAmount', e.target.value)}
                                    />
                                </div>
                            </div>}
                        </div>

                        <h1>Attachments</h1>
                        <div className="mb-3">
                            <label htmlFor="selfiePictureInput" className="form-label py-2">Selfie Picture</label>
                            <input 
                                className="form-control" 
                                type="file" 
                                id="selfiePictureInput"
                                name="selfiePicture"
                                accept="image/*"
                                disabled={uploading}
                                onChange={(e) => uploadAttachmentImage("selfiePicture", e.target.files[0])}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="carPictureInput" className="form-label py-2">Car Picture</label>
                            <input 
                                className="form-control" 
                                type="file" 
                                id="carPictureInput"
                                name="carPicture"
                                accept="image/*"
                                disabled={uploading}
                                onChange={(e) => uploadAttachmentImage("carPicture", e.target.files[0])}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cnicCopyInput" className="form-label py-2">CNIC Copy</label>
                            <input 
                                className="form-control" 
                                type="file" 
                                id="cnicCopyInput"
                                name="cnicCopy"
                                accept="image/*"
                                disabled={uploading}
                                onChange={(e) => uploadAttachmentImage("cnicCopy", e.target.files[0])}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="receiptImageInput" className="form-label py-2">Receipt Image</label>
                            <input 
                                className="form-control" 
                                type="file" 
                                id="receiptImageInput"
                                name="receiptImage"
                                accept="image/*"
                                disabled={uploading}
                                onChange={(e) => uploadAttachmentImage("receiptImage", e.target.files[0])}
                            />
                            {uploading && (
                                <div className="d-flex align-items-center my-3">
                                    <Spinner color="primary" />
                                    <span>Uploading image, please wait...</span>
                                </div>
                            )}
                        </div>

                        <h1>Car Details</h1>
                        {/* Car Details sections remain the same, just adding proper name attributes */}
                        <label className="form-label py-2">Wheel Caps</label>
                        <div>
                            <div className="d-flex">
                                <div className="p-2 border border-secondary border-1 rounded-3 mx-2">
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="wheelCaps" 
                                            id="wheelCapsYes" 
                                            checked={form.carDetails.wheelCaps.present === true}
                                            onChange={() => handleCarDetailChange('wheelCaps', 'present', true)}
                                        />
                                        <label className="form-check-label" htmlFor="wheelCapsYes">
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className="p-2 border border-secondary border-1 rounded-3 mx-2">
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="wheelCaps" 
                                            id="wheelCapsNo" 
                                            checked={form.carDetails.wheelCaps.present === false}
                                            onChange={() => handleCarDetailChange('wheelCaps', 'present', false)}
                                        />
                                        <label className="form-check-label" htmlFor="wheelCapsNo">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <input 
                                type="text" 
                                className='form-control my-2' 
                                placeholder='Remarks'
                                name="wheelCapsRemarks"
                                autoComplete="off"
                                value={form.carDetails.wheelCaps.remarks}
                                onChange={(e) => handleCarDetailChange('wheelCaps', 'remarks', e.target.value)}
                            />
                        </div>

                        {/* Continue with other car details sections... */}
                        {/* I'll include just one more for brevity, but you should add name attributes to all similar sections */}
                        
                        <label className="form-label py-2">Footmats</label>
                        <div>
                            <div className="d-flex">
                                <div className="p-2 border border-secondary border-1 rounded-3 mx-2">
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="footmats" 
                                            id="footmatsYes" 
                                            checked={form.carDetails.footmats.present === true}
                                            onChange={() => handleCarDetailChange('footmats', 'present', true)}
                                        />
                                        <label className="form-check-label" htmlFor="footmatsYes">
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className="p-2 border border-secondary border-1 rounded-3 mx-2">
                                    <div className="form-check">
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="footmats" 
                                            id="footmatsNo" 
                                            checked={form.carDetails.footmats.present === false}
                                            onChange={() => handleCarDetailChange('footmats', 'present', false)}
                                        />
                                        <label className="form-check-label" htmlFor="footmatsNo">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <input 
                                type="text" 
                                className='form-control my-2' 
                                placeholder='Remarks'
                                name="footmatsRemarks"
                                autoComplete="off"
                                value={form.carDetails.footmats.remarks}
                                onChange={(e) => handleCarDetailChange('footmats', 'remarks', e.target.value)}
                            />
                        </div>
                         <label className="form-label py-2">Airpress</label>
                        <div>
                            <div className="d-flex">
                                <div className="p-2 border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="airpress" 
                                            id="airpressYes" 
                                            checked={form.carDetails.airpress.present === true}
                                            onChange={() => handleCarDetailChange('airpress', 'present', true)}
                                        />
                                        <label class="form-check-label" for="airpressYes">
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className="p-2   border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="airpress" 
                                            id="airpressNo" 
                                            checked={form.carDetails.airpress.present === false}
                                            onChange={() => handleCarDetailChange('airpress', 'present', false)}
                                        />
                                        <label class="form-check-label" for="airpressNo">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <input 
                                type="text" 
                                className='form-control my-2' 
                                placeholder='Remarks' 
                                value={form.carDetails.airpress.remarks}
                                onChange={(e) => handleCarDetailChange('airpress', 'remarks', e.target.value)}
                            />
                        </div>
                        <label className="form-label py-2">Cleaning Cloth</label>
                        <div>
                            <div className="d-flex">
                                <div className="p-2 border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="cleaningCloth" 
                                            id="cleaningClothYes" 
                                            checked={form.carDetails.cleaningCloth.present === true}
                                            onChange={() => handleCarDetailChange('cleaningCloth', 'present', true)}
                                        />
                                        <label class="form-check-label" for="cleaningClothYes">
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className="p-2   border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="cleaningCloth" 
                                            id="cleaningClothNo" 
                                            checked={form.carDetails.cleaningCloth.present === false}
                                            onChange={() => handleCarDetailChange('cleaningCloth', 'present', false)}
                                        />
                                        <label class="form-check-label" for="cleaningClothNo">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <input 
                                type="text" 
                                className='form-control my-2' 
                                placeholder='Remarks' 
                                value={form.carDetails.cleaningCloth.remarks}
                                onChange={(e) => handleCarDetailChange('cleaningCloth', 'remarks', e.target.value)}
                            />
                        </div>
                        <label className="form-label py-2">Air Conditioner</label>
                        <div>
                            <div className="d-flex">
                                <div className="p-2 border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="airConditioner" 
                                            id="airConditionerYes" 
                                            checked={form.carDetails.airConditioner.present === true}
                                            onChange={() => handleCarDetailChange('airConditioner', 'present', true)}
                                        />
                                        <label class="form-check-label" for="airConditionerYes">
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className="p-2   border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="airConditioner" 
                                            id="airConditionerNo" 
                                            checked={form.carDetails.airConditioner.present === false}
                                            onChange={() => handleCarDetailChange('airConditioner', 'present', false)}
                                        />
                                        <label class="form-check-label" for="airConditionerNo">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <input 
                                type="text" 
                                className='form-control my-2' 
                                placeholder='Remarks' 
                                value={form.carDetails.airConditioner.remarks}
                                onChange={(e) => handleCarDetailChange('airConditioner', 'remarks', e.target.value)}
                            />
                        </div>
                        <label className="form-label py-2">Lights</label>
                        <div>
                            <div className="d-flex">
                                <div className="p-2 border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="lights" 
                                            id="lightsYes" 
                                            checked={form.carDetails.lights.present === true}
                                            onChange={() => handleCarDetailChange('lights', 'present', true)}
                                        />
                                        <label class="form-check-label" for="lightsYes">
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className="p-2   border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="lights" 
                                            id="lightsNo" 
                                            checked={form.carDetails.lights.present === false}
                                            onChange={() => handleCarDetailChange('lights', 'present', false)}
                                        />
                                        <label class="form-check-label" for="lightsNo">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <input 
                                type="text" 
                                className='form-control my-2' 
                                placeholder='Remarks' 
                                value={form.carDetails.lights.remarks}
                                onChange={(e) => handleCarDetailChange('lights', 'remarks', e.target.value)}
                            />
                        </div>
                        <label className="form-label py-2">Jack Rod</label>
                        <div>
                            <div className="d-flex">
                                <div className="p-2 border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="jackRod" 
                                            id="jackRodYes" 
                                            checked={form.carDetails.jackRod.present === true}
                                            onChange={() => handleCarDetailChange('jackRod', 'present', true)}
                                        />
                                        <label class="form-check-label" for="jackRodYes">
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className="p-2   border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="jackRod" 
                                            id="jackRodNo" 
                                            checked={form.carDetails.jackRod.present === false}
                                            onChange={() => handleCarDetailChange('jackRod', 'present', false)}
                                        />
                                        <label class="form-check-label" for="jackRodNo">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <input 
                                type="text" 
                                className='form-control my-2' 
                                placeholder='Remarks' 
                                value={form.carDetails.jackRod.remarks}
                                onChange={(e) => handleCarDetailChange('jackRod', 'remarks', e.target.value)}
                            />
                        </div>
                        <label className="form-label py-2">Spanner</label>
                        <div>
                            <div className="d-flex">
                                <div className="p-2 border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="spanner" 
                                            id="spannerYes" 
                                            checked={form.carDetails.spanner.present === true}
                                            onChange={() => handleCarDetailChange('spanner', 'present', true)}
                                        />
                                        <label class="form-check-label" for="spannerYes">
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className="p-2   border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="spanner" 
                                            id="spannerNo" 
                                            checked={form.carDetails.spanner.present === false}
                                            onChange={() => handleCarDetailChange('spanner', 'present', false)}
                                        />
                                        <label class="form-check-label" for="spannerNo">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <input 
                                type="text" 
                                className='form-control my-2' 
                                placeholder='Remarks' 
                                value={form.carDetails.spanner.remarks}
                                onChange={(e) => handleCarDetailChange('spanner', 'remarks', e.target.value)}
                            />
                        </div>
                        <label className="form-label py-2">Stepny</label>
                        <div>
                            <div className="d-flex">
                                <div className="p-2 border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="stepny" 
                                            id="stepnyYes" 
                                            checked={form.carDetails.stepny.present === true}
                                            onChange={() => handleCarDetailChange('stepny', 'present', true)}
                                        />
                                        <label class="form-check-label" for="stepnyYes">
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div className="p-2   border border-secondary border-1 rounded-3 mx-2">
                                    <div class="form-check">
                                        <input 
                                            class="form-check-input" 
                                            type="radio" 
                                            name="stepny" 
                                            id="stepnyNo" 
                                            checked={form.carDetails.stepny.present === false}
                                            onChange={() => handleCarDetailChange('stepny', 'present', false)}
                                        />
                                        <label class="form-check-label" for="stepnyNo">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <input 
                                type="text" 
                                className='form-control my-2' 
                                placeholder='Remarks' 
                                value={form.carDetails.stepny.remarks}
                                onChange={(e) => handleCarDetailChange('stepny', 'remarks', e.target.value)}
                            />
                        </div>

                        {/* <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="exampleCheck1" />
                            <label class="form-check-label" for="exampleCheck1">Check me out</label>
                        </div> */}
                        {/* <button type="submit" class="btn btn-primary">Submit</button> */}

                        {/* Add similar name attributes to all other car detail sections */}
                        {/* ... rest of car details sections ... */}
                        
                    </form>
                    <div className="d-flex justify-content-end py-2">
                        <button 
                            className="btn btn-outline-primary" 
                            disabled={uploading}
                            onClick={async () => {
                                try {
                                    setErrorMessage(''); // Clear any previous errors
                                    await handleCreateRental(form);
                                    setShowSuccessModal(true);
                                    // Reset form after successful creation
                                    
                                    setform({
                                        user: '',
                                        cnic: '',
                                        reference: '',
                                        carNumber: '',
                                        fuelAmount: '',
                                        carMileage: '',
                                        location: '',
                                        payment: {
                                            mode: 'Cheque',
                                            cheque: {
                                                chequeNumber: '',
                                                chequePicture: '',
                                                paymentAmount: '',
                                                bankName: ''
                                            },
                                            online: {
                                                paymentAmount: '',
                                                bankName: ''
                                            },
                                            cash: {
                                                paymentAmount: ''
                                            }
                                        },
                                        attachments: {
                                            selfiePicture: '',
                                            carPicture: '',
                                            cnicCopy: '',
                                            receiptImage: ''
                                        },
                                        carDetails: {
                                            wheelCaps: { present: false, remarks: '' },
                                            footmats: { present: false, remarks: '' },
                                            airpress: { present: false, remarks: '' },
                                            cleaningCloth: { present: false, remarks: '' },
                                            airConditioner: { present: false, remarks: '' },
                                            lights: { present: false, remarks: '' },
                                             jackRod: { present: false, remarks: '' },
            spanner: { present: false, remarks: '' },
            stepny: { present: false, remarks: '' },
                                        }
                                    });
                                } catch (err) {
                                    console.error("Create failed:", err);
                                    setErrorMessage(err.message || "Something went wrong while creating the rental. Please try again.");
                                }
                            }}
                        >
                            {uploading ? (
                                <div>
                                    <Spinner size={20} />
                                    Creating...
                                </div>
                            ) : (
                                'Create'
                            )}
                        </button>
                    </div>
                </div>}

                {/* Rest of the component remains the same... */}
                {currentState == "Cover" && <div className='my-3'>
                    <div className="d-flex justify-content-between w-100">
                        <button type="button" className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Add Images
                        </button>
                        <button type="button" className="btn btn-outline-success" onClick={() => { editImages() }}>
                            Save Images
                        </button>
                    </div>
                    <div className="row my-3">
                        {coverImages.map((e, i) => {
                            return <div key={i} className="col-md-3 py-2 col-4">
                                <div
                                    draggable
                                    onDragStart={() => { setfirstdndElement({ element: e, index: i }); console.log(i) }}
                                    onDragEnter={() => { setseconddndElement({ element: e, index: i }); console.log(i) }}
                                    onDragEnd={() => changeOrder()}
                                    className="card shadow-none position-relative">
                                    <span onClick={() => { excludeImage(i) }} className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        <i className="fa fa-times" aria-hidden="true"></i>
                                    </span>
                                    <img src={e.url} alt="" />
                                </div>
                            </div>
                        })}
                    </div>
                </div>}

                {currentState == "Room" && <div className="my-3">
                    {/* <AdminRooms theArr={allPackageData} anotherArr={anotherArr} /> */}
                </div>}
            </div>

            {/* Modal for adding images */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add Images</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="formFile" className="form-label py-2">Select Image</label>
                                <input 
                                    accept="image/*" 
                                    onChange={(e) => { 
                                        console.log(e.target.files[0]); 
                                        e.target.files[0] && previewPhoto(e.target.files[0]) 
                                    }} 
                                    className="form-control" 
                                    type="file" 
                                    id="formFile" 
                                />
                                {selectedImage && <img className='w-100 my-2' src={selectedImage} alt="" />}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button ref={modalRef} onClick={() => { setSelectedImage(null) }} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={!selectedImage || setImageLoader} onClick={() => cloudinary(imageForUpload)} type="button" class="btn btn-outline-primary">Upload</button>
                            {setImageLoader && <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            {showSuccessModal && (
  <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header bg-success text-white">
          <h5 className="modal-title">Success</h5>
          <button type="button" className="btn-close" onClick={() => setShowSuccessModal(false)}></button>
        </div>
        <div className="modal-body">
          <p>✅ New car has been created successfully!</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-success" onClick={() => setShowSuccessModal(false)}>Close</button>
        </div>
      </div>
    </div>
  </div>
)}
{errorModal && (
  <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header bg-danger text-white">
          <h5 className="modal-title">Error</h5>
          <button type="button" className="btn-close" onClick={() => setErrorModal(false)}></button>
        </div>
        <div className="modal-body">
          <p>❌ {modalErrorText}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-danger" onClick={() => setErrorModal(false)}>Close</button>
        </div>
      </div>
    </div>
  </div>
)}

        </div >
    )
}

export default Dashboard