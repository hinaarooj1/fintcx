import React, { useState, useEffect, useReducer } from 'react';
import {   Link, useNavigate } from 'react-router-dom';
import { SVGICON } from '../../constant/theme';
import Bitcoin from "../../../assets/images/img/btc.svg"
import EthLogo from "../../../assets/images/img/eth.svg"
import UsdtLogo from "../../../assets/images/img/usdt-logo.svg"
import { toast } from 'react-toastify';
import { useAuthUser } from 'react-auth-kit';
import { createUserTransactionApi, getCoinsUserApi, getsignUserApi } from '../../../Api/Service';
import axios from 'axios';
import { Button, Card, Col, Form,DropdownDivider, InputGroup, Modal, Row, Spinner } from 'react-bootstrap';
import './style.css'
import Truncate from 'react-truncate-inside/es';
 

const Orders = () => { 

    const [Active, setActive] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [btcBalance, setbtcBalance] = useState(0);
    const [isDisable, setisDisable] = useState(false);

    const [confirmationPopup, setConfirmationPopup] = useState(false);
    const [UserData, setUserData] = useState(true);
    const [fractionBalance, setfractionBalance] = useState("00");
    const [ethBalance, setethBalance] = useState(0);
    const [usdtBalance, setusdtBalance] = useState(0);
    let toggleBar = () => {
        if (Active === true) {
            setActive(false);
        } else {
            setActive(true);
        }
    };

    const [liveBtc, setliveBtc] = useState(null);

    const authUser = useAuthUser();
    const Navigate = useNavigate();
    const [isUser, setIsUser] = useState({});
    const getsignUser = async () => {
        try {
            const formData = new FormData();
            formData.append("id", authUser().user._id);
            const userCoins = await getsignUserApi(formData);

            if (userCoins.success) {
                setIsUser(userCoins.signleUser);

                return;
            } else {
                toast.dismiss();
                toast.error(userCoins.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
        }
    };
    //
    const getCoins = async (data) => {
        let id = data._id;
        try {
            const response = await axios.get(
                "https://api.coindesk.com/v1/bpi/currentprice.json"
            );
            const userCoins = await getCoinsUserApi(id);

            if (response && userCoins.success) {
                setUserData(userCoins.getCoin);
                // setUserTransactions;
                let val = response.data.bpi.USD.rate.replace(/,/g, "");

                setliveBtc(val);
                setisLoading(false);
                // tx
                const btc = userCoins.getCoin.transactions.filter((transaction) =>
                    transaction.trxName.includes("bitcoin")
                );
                const btccomplete = btc.filter((transaction) =>
                    transaction.status.includes("completed")
                );
                let btcCount = 0;
                let btcValueAdded = 0;
                for (let i = 0; i < btccomplete.length; i++) {
                    const element = btccomplete[i];
                    btcCount = element.amount;
                    btcValueAdded += btcCount;
                }
                setbtcBalance(btcValueAdded);
                // tx
                // tx
                const eth = userCoins.getCoin.transactions.filter((transaction) =>
                    transaction.trxName.includes("ethereum")
                );
                const ethcomplete = eth.filter((transaction) =>
                    transaction.status.includes("completed")
                );
                let ethCount = 0;
                let ethValueAdded = 0;
                for (let i = 0; i < ethcomplete.length; i++) {
                    const element = ethcomplete[i];
                    ethCount = element.amount;
                    ethValueAdded += ethCount;
                }
                setethBalance(ethValueAdded);
                // tx
                // tx
                const usdt = userCoins.getCoin.transactions.filter((transaction) =>
                    transaction.trxName.includes("tether")
                );
                const usdtcomplete = usdt.filter((transaction) =>
                    transaction.status.includes("completed")
                );
                let usdtCount = 0;
                let usdtValueAdded = 0;
                for (let i = 0; i < usdtcomplete.length; i++) {
                    const element = usdtcomplete[i];
                    usdtCount = element.amount;
                    usdtValueAdded += usdtCount;
                }
                setusdtBalance(usdtValueAdded);
                // tx

                const totalValue = (
                    btcValueAdded * liveBtc +
                    ethValueAdded * 2241.86 +
                    usdtValueAdded
                ).toFixed(2);

                //
                const [integerPart, fractionalPart] = totalValue.split(".");

                const formattedTotalValue = parseFloat(integerPart).toLocaleString(
                    "en-US",
                    {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    }
                );

                //
                setfractionBalance(fractionalPart);
                return;
            } else {
                toast.dismiss();
                toast.error(userCoins.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
        }
    };
    //
    const [selectedPayment, setSelectedPayment] = useState(null); // State to store the selected payment method

    // Function to handle selection change in the dropdown menu
    const handlePaymentSelection = (event) => {
        const selectedValue = event.target.value;
        console.log("selectedValue: ", selectedValue);
        if (selectedValue === "Select a Payment Method") {
            setSelectedPayment(null); // Set selected payment to null if the first option is selected
        } else {
            setSelectedPayment(selectedValue); // Otherwise, update the selected payment state with the value of the selected option
        }
    };

    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopyClick = () => {
        const textField = document.createElement("textarea");
        textField.innerText = UserData.btcTokenAddress;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        document.body.removeChild(textField);
        setCopySuccess(true);

        // You can optionally reset the copy success state after a short duration
        setTimeout(() => {
            setCopySuccess(false);
        }, 2000);
    };
    const [copySuccess2, setCopySuccess2] = useState(false);

    const handleCopyClick2 = () => {
        const textField = document.createElement("textarea");
        textField.innerText = UserData.ethTokenAddress;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        document.body.removeChild(textField);
        setCopySuccess2(true);

        // You can optionally reset the copy success state after a short duration
        setTimeout(() => {
            setCopySuccess2(false);
        }, 2000);
    };
    const [copySuccess3, setCopySuccess3] = useState(false);

    const handleCopyClick3 = () => {
        const textField = document.createElement("textarea");
        textField.innerText = UserData.usdtTokenAddress;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        document.body.removeChild(textField);
        setCopySuccess3(true);

        // You can optionally reset the copy success state after a short duration
        setTimeout(() => {
            setCopySuccess3(false);
        }, 2000);
    };

    useEffect(() => {
        getsignUser();
        if (authUser().user.role === "user") {
            getCoins(authUser().user);
            return;
        } else if (authUser().user.role === "admin") {
            Navigate("/admin/dashboard");
            return;
        }
    }, []);
    // withdraw
    const [modal3, setModal3] = useState(false);
    const [depositName, setdepositName] = useState("");

    const [transactionDetail, settransactionDetail] = useState({
        amountMinus: "",
        txId: "",
    });
    const [transactionDetailId, settransactionDetailId] = useState({
        amountMinus: "",
        txId: "",
    });
    let handleTransactionId = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        settransactionDetailId({ ...transactionDetailId, [name]: value });
    };
    let handleTransaction = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        // Assuming depositBalance is a state variable representing the available balance for the selected deposit type
        let depositBalance;
        if (depositName === "bitcoin") {
            depositBalance = btcBalance.toFixed(8);
        } else if (depositName === "ethereum") {
            depositBalance = ethBalance.toFixed(8);
        } else if (depositName === "tether") {
            depositBalance = usdtBalance.toFixed(8);
        }

        // Allow only up to 9 digits
        const sanitizedValue = value.replace(/[^0-9.]/g, "").slice(0, 9);

        // Parse values to float for comparison
        const enteredValue = parseFloat(sanitizedValue);
        const maxBalance = parseFloat(depositBalance);

        // Check if enteredValue is less than or equal to depositBalance
        if (!isNaN(enteredValue) && enteredValue <= maxBalance) {
            settransactionDetail({ ...transactionDetail, [name]: sanitizedValue });
        } else if (sanitizedValue === "") {
            // If the input is cleared, set the value to an empty string
            settransactionDetail({ ...transactionDetail, [name]: "" });
        } else {
            // If enteredValue is greater than depositBalance or not a valid number, set the value to depositBalance
            settransactionDetail({ ...transactionDetail, [name]: depositBalance });
        }
    };
    let tetherDepositMinus = () => {
        setdepositName("tether");
        setModal3(true);
    };

    let btcDepositMinus = () => {
        setdepositName("bitcoin");
        setModal3(true);
    };
    let ethDepositMinus = () => {
        setdepositName("ethereum");

        setModal3(true);
    };
    let closeDeposit = () => {
        setdepositName("");
        settransactionDetail({
            amountMinus: 0,
        });
        settransactionDetailId({
            txId: "",
        });
        setModal3(false);
        setConfirmationPopup(false);
    };

    // const postUserTransaction = async (e) => {
    //   console.log("Value of e:", e);

    //   try {
    //     let id = authUser().user._id;
    //     setisDisable(true);

    //     if (
    //       parseFloat(transactionDetail.amountMinus) <= 0 ||
    //       transactionDetail.amountMinus.trim() === "00" ||
    //       transactionDetail.amountMinus.trim() === "0.000"
    //     ) {
    //       toast.dismiss();
    //       toast.error(
    //         "Transaction amount must be a positive value and cannot be equal to zero"
    //       );
    //       return;
    //     }
    //     let body;
    //     if (e == "crypto") {
    //       body = {
    //         trxName: depositName,
    //         amount: -transactionDetail.amountMinus,
    //         txId: transactionDetailId.txId,
    //         e: e,
    //       };
    //       if (!body.trxName || !body.amount || !body.txId) {
    //         console.log("body.amount: ", body.amount);
    //         console.log("body.trxName: ", body.trxName);
    //         toast.dismiss();
    //         toast.error("Fill all the required fields");
    //         return;
    //       }
    //     } else if (e == "bank") {
    //       body = {
    //         trxName: depositName,
    //         amount: -transactionDetail.amountMinus,
    //         selectedPayment: selectedPayment,
    //         e: e,
    //       };
    //       if (!body.trxName || !body.amount) {
    //         toast.dismiss();
    //         toast.error("Fill all the required fields");
    //         return;
    //       }
    //       if (selectedPayment === null) {
    //         toast.dismiss();
    //         toast.error("Please select a Payment Method");
    //         return;
    //       }
    //     }

    //     const newTransaction = await createUserTransactionApi(id, body);

    //     if (newTransaction.success) {
    //       setSelectedPayment(null);
    //       toast.dismiss();
    //       toast.success(newTransaction.msg);

    //       closeDeposit();
    //     } else {
    //       toast.dismiss();
    //       toast.error(newTransaction.msg);
    //     }
    //   } catch (error) {
    //     toast.dismiss();
    //     toast.error(error);
    //   } finally {
    //     setisDisable(false);
    //   }
    // };

    const [activeBank, setactiveBank] = useState(false);
    let activeCrypto = () => {
        setactiveBank(false);
    };
    let activeBankOne = () => {
        setactiveBank(true);
    };
    //
    const postUserTransaction = async (e) => {
        console.log("Value of e:", e);

        let id = authUser().user._id;

        if (
            parseFloat(transactionDetail.amountMinus) <= 0 ||
            transactionDetail.amountMinus.trim() === "00" ||
            transactionDetail.amountMinus.trim() === "0.000"
        ) {
            toast.dismiss();
            toast.error(
                "Transaction amount must be a positive value and cannot be equal to zero"
            );
            return;
        }
        let body;
        if (e == "crypto") {
            body = {
                trxName: depositName,
                amount: -transactionDetail.amountMinus,
                txId: transactionDetailId.txId,
                e: e,
            };
            if (!body.trxName || !body.amount || !body.txId) {
                console.log("body.amount: ", body.amount);
                console.log("body.trxName: ", body.trxName);
                toast.dismiss();
                toast.error("Fill all the required fields");
                return;
            }
            try {
                let id = authUser().user._id;
                setisDisable(true);
                const newTransaction = await createUserTransactionApi(id, body);

                if (newTransaction.success) {
                    setSelectedPayment(null);
                    toast.dismiss();
                    toast.success(newTransaction.msg);
                    closeDeposit();
                } else {
                    toast.dismiss();
                    toast.error(newTransaction.msg);
                }
            } catch (error) {
                toast.dismiss();
                toast.error(error);
            } finally {
                setisDisable(false);
            }
        } else if (e == "bank") {
            body = {
                trxName: depositName,
                amount: -transactionDetail.amountMinus,
                selectedPayment: selectedPayment,
                e: e,
            };
            if (!body.trxName || !body.amount) {
                toast.dismiss();
                toast.error("Fill all the required fields");
                return;
            }
            if (selectedPayment === null) {
                toast.dismiss();
                toast.error("Please select a Payment Method");
                return;
            }
            setConfirmationPopup(true);
            setModal3(false);
        }

        // Trigger the confirmation popup instead of API call
    };

    const confirmTransaction = async (e, body) => {
        console.log("body: ", body);
        try {
            setisDisable(true);
            let body;
            if (e == "crypto") {
                body = {
                    trxName: depositName,
                    amount: -transactionDetail.amountMinus,
                    txId: transactionDetailId.txId,
                    e: e,
                };
                if (!body.trxName || !body.amount || !body.txId) {
                    console.log("body.amount: ", body.amount);
                    console.log("body.trxName: ", body.trxName);
                    toast.dismiss();
                    toast.error("Fill all the required fields");
                    return;
                }
            } else if (e == "bank") {
                body = {
                    trxName: depositName,
                    amount: -transactionDetail.amountMinus,
                    selectedPayment: selectedPayment,
                    e: e,
                };
                if (!body.trxName || !body.amount) {
                    toast.dismiss();
                    toast.error("Fill all the required fields");
                    return;
                }
                if (selectedPayment === null) {
                    toast.dismiss();
                    toast.error("Please select a Payment Method");
                    return;
                }
            }
            let id = authUser().user._id;

            const newTransaction = await createUserTransactionApi(id, body);

            if (newTransaction.success) {
                setSelectedPayment(null);
                toast.dismiss();
                toast.success(newTransaction.msg);
                closeDeposit();
                setConfirmationPopup(false);
            } else {
                toast.dismiss();
                toast.error(newTransaction.msg);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error);
        } finally {
            setisDisable(false);
        }
    };

    const chackboxFun = (type) => {
        setTimeout(() => {
            const chackbox = document.querySelectorAll(".order-table input");
            const motherChackBox = document.querySelector(".order-table-head input");
            for (let i = 0; i < chackbox.length; i++) {
                const element = chackbox[i];
                if (type === "all") {
                    if (motherChackBox.checked) {
                        element.checked = true;
                    } else {
                        element.checked = false;
                    }
                } else {
                    if (!element.checked) {
                        motherChackBox.checked = false;
                        break;
                    } else {
                        motherChackBox.checked = true;
                    }
                }
            }
        }, 100)
    };
    return (
        <>
            <div className="row">
                <div className="col-xxl-12">
                    <div className="card">
                        <Card.Header>
                            <Card.Title>Assets</Card.Title>
                        </Card.Header>
                        <div className="card-body">
                            {isLoading ? (
                                <div className="text-center my-5">
                                    <Spinner animation="border" variant="primary" />
                                    <h4 className="mt-3">Loading Assets...</h4>
                                    <p>Please wait while we load the assets.</p>
                                </div>
                            ) : UserData === null || !UserData ? (
                                <div className="text-center my-5">
                                    <h4> No Assets found!</h4>
                                </div>) : (


                                <div className="table-responsive">
                                    <table className="table tbleas tickettable display mb-4 no-footer" id="example6">
                                        <thead>
                                            <tr>

                                                <th className='tleft'>Currency</th>
                                                <th>Balance</th>
                                                <th>Withdraw</th>
                                                <th>Address</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr  >

                                                <td className='tleft'>
                                                    <span className="font-w600 fs-14"><img className='img30' src={Bitcoin} alt="" />Bitcoin</span>
                                                </td>
                                                <td className="fs-14 font-w400"> {`${btcBalance.toFixed(8)} (${(
                                                    btcBalance * liveBtc
                                                ).toFixed(2)} USD)`}</td>
                                                <td>
                                                    <Button
                                                        onClick={btcDepositMinus} className="me-2" variant="primary btn-rounded">
                                                        Withdraw
                                                    </Button>

                                                </td>
                                                <td>   <p
                                                    className="jas d-flex"
                                                    disabled="false"
                                                >
                                                    <span className="chote">   <Truncate
                                                        offset={6}
                                                        text={UserData.btcTokenAddress}
                                                        width="180"
                                                    />
                                                    </span>
                                                    <div
                                                        className="price-sec cursor-pointer"
                                                        onClick={handleCopyClick}
                                                    >
                                                        {" "}
                                                        {copySuccess ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                x="0px"
                                                                y="0px"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 30 30"
                                                            >
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"
                                                                ></path>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                data-v-cd102a71
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                aria-hidden="true"
                                                                role="img"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <g
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                >
                                                                    <rect
                                                                        width={13}
                                                                        height={13}
                                                                        x={9}
                                                                        y={9}
                                                                        rx={2}
                                                                        ry={2}
                                                                    />
                                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                                </g>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </p></td>

                                            </tr>
                                            <tr  >

                                                <td className='tleft'>
                                                    <span className="font-w600 fs-14"><img className='img30' src={EthLogo} alt="" />Ethereum</span>
                                                </td>
                                                <td className="fs-14 font-w400">       {`${ethBalance.toFixed(8)} (${(
                                                    ethBalance * 2241.86
                                                ).toFixed(2)} USD)`}</td>
                                                <td>
                                                    <Button
                                                        onClick={ethDepositMinus} className="me-2" variant="primary btn-rounded">
                                                        Withdraw
                                                    </Button>

                                                </td>
                                                <td>   <p
                                                    className="jas d-flex"
                                                    disabled="false"
                                                >
                                                    <span className="chote">   <Truncate
                                                        offset={6}

                                                        text=
                                                        {UserData.ethTokenAddress}
                                                        width="180"
                                                    />
                                                    </span>
                                                    <div
                                                        className="price-sec cursor-pointer"
                                                        onClick={handleCopyClick2}
                                                    >
                                                        {" "}
                                                        {copySuccess2 ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                x="0px"
                                                                y="0px"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 30 30"
                                                            >
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"
                                                                ></path>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                data-v-cd102a71
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                aria-hidden="true"
                                                                role="img"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <g
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                >
                                                                    <rect
                                                                        width={13}
                                                                        height={13}
                                                                        x={9}
                                                                        y={9}
                                                                        rx={2}
                                                                        ry={2}
                                                                    />
                                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                                </g>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </p></td>

                                            </tr>
                                            <tr  >

                                                <td className='tleft'>
                                                    <span className="font-w600 fs-14"><img className='img30' src={UsdtLogo} alt="" />USDT</span>
                                                </td>
                                                <td className="fs-14 font-w400">  {`${usdtBalance.toFixed(
                                                    8
                                                )} (${usdtBalance.toFixed(2)} USD)`}</td>
                                                <td>
                                                    <Button
                                                        onClick={tetherDepositMinus} className="me-2" variant="primary btn-rounded">
                                                        Withdraw
                                                    </Button>

                                                </td>
                                                <td>   <p
                                                    className="jas d-flex"
                                                    disabled="false"
                                                >
                                                    <span className="chote">   <Truncate
                                                        offset={6}

                                                        text={UserData.usdtTokenAddress}
                                                        width="180"
                                                    />
                                                    </span>
                                                    <div
                                                        className="price-sec cursor-pointer"
                                                        onClick={handleCopyClick3}
                                                    >
                                                        {" "}
                                                        {copySuccess3 ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                x="0px"
                                                                y="0px"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 30 30"
                                                            >
                                                                <path
                                                                    fill="currentColor"
                                                                    d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z"
                                                                ></path>
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                data-v-cd102a71
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                aria-hidden="true"
                                                                role="img"
                                                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                                                width="1em"
                                                                height="1em"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <g
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                >
                                                                    <rect
                                                                        width={13}
                                                                        height={13}
                                                                        x={9}
                                                                        y={9}
                                                                        rx={2}
                                                                        ry={2}
                                                                    />
                                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                                </g>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </p></td>

                                            </tr>


                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {modal3 &&

                <Modal className="fade modal89"
                    show={modal3}
                    onHide={closeDeposit} centered>
                    <Modal.Header className="d-block">
                        <div className="d-flex justify-content-between align-items-center">
                            <Modal.Title>Create new Withdrawal</Modal.Title>
                            <Button
                                variant=""
                                onClick={closeDeposit}
                                className="btn-close"
                                
                            ></Button>
                        </div>
                        <div className="mt-3 axs text-center">
                            <button
                                className={activeBank ? "btn  btn-outline-primary me-2" : "btn btn-primary  btn me-2"}
                                onClick={activeCrypto}
                            >
                                Crypto Withdraw
                            </button>
                            <button
                                className={activeBank ? "btn  btn-primary" : "btn btn-outline-primary"}
                                onClick={activeBankOne}
                            >
                                Bank Withdraw
                            </button>
                        </div>
                    </Modal.Header>
                    <Modal.Body>

                        <h6 className="font-heading text-muted-400 text-sm font-medium leading-6">
                            {" "}
                            Selected Currency:{" "}
                            <span
                                className="inline-block px-3 bgact font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-info-500 dark:bg-info-500 text-white"
                                size="xs"
                                style={{ textTransform: "capitalize" }}
                            >
                                {depositName}
                            </span>
                        </h6>
                        <div className='pt-3'>
                            <div className="mb-3 ">
                                <label>Amount</label>
                                <input type="number"
                                    onFocus={() => (window.onwheel = () => false)} // Disable scrolling on focus
                                    onBlur={() => (window.onwheel = null)}
                                    onKeyDown={(e) =>
                                        [
                                            "ArrowUp",
                                            "ArrowDown",
                                            "e",
                                            "E",
                                            "+",
                                            "-",
                                            "*",
                                            "",
                                        ].includes(e.key) && e.preventDefault()
                                    }
                                    onChange={handleTransaction}
                                    value={transactionDetail.amountMinus}
                                    name="amountMinus"
                                    placeholder="Ex: 0.00000000"
                                    className="form-control"
                                />
                                {
                                    depositName === "bitcoin" ? (
                                        <p
                                            onClick={() =>
                                                settransactionDetail({
                                                    amountMinus: btcBalance.toFixed(8),
                                                })
                                            }
                                            className="text-muted-500 cursor-pointer dark:text-muted-400 mt-2 font-sans text-sm"
                                        >
                                            Available: {btcBalance.toFixed(8)} BTC
                                        </p>
                                    ) : depositName === "ethereum" ? (
                                        <p
                                            onClick={() =>
                                                settransactionDetail({
                                                    amountMinus: ethBalance.toFixed(8),
                                                })
                                            }
                                            className="text-muted-500 cursor-pointer dark:text-muted-400 mt-2 font-sans text-sm"
                                        >
                                            Available: {ethBalance.toFixed(8)} ETH
                                        </p>
                                    ) : depositName === "tether" ? (
                                        <p
                                            onClick={() =>
                                                settransactionDetail({
                                                    amountMinus: usdtBalance.toFixed(8),
                                                })
                                            }
                                            className="text-muted-500 cursor-pointer dark:text-muted-400 mt-2 font-sans text-sm"
                                        >
                                            Available: {usdtBalance.toFixed(8)} USDT
                                        </p>
                                    ) : (
                                        ""
                                    )
                                }
                            </div>
                        </div>
                        <DropdownDivider/>
                        <div>
                            <div className="border-top pt-4 mt-2">
                                {activeBank ? (
                                    <>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h3 className="text-muted-400 font-heading text-base font-medium">
                                                    Payment Method
                                                </h3>
                                            </div>
                                        </div>
                                        <Form.Group className="mt-3">
                                            <Form.Control as="select" onChange={handlePaymentSelection}>
                                                <option>Select a Payment Method</option>
                                                {isUser.payments.map((item, index) => (
                                                    <option key={index}>
                                                        {item.type === "bank" ? (
                                                            item.bank.accountName
                                                        ) : (
                                                            <>
                                                                <span className="text-uppercase">
                                                                    {item.card.cardCategory.toUpperCase()}
                                                                </span>{" "}
                                                                *{item.card.cardNumber.slice(-4)}
                                                            </>
                                                        )}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </>
                                ) : (
                                    <>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <h3 className="text-muted-400 font-heading text-base font-medium">
                                                    Transaction details
                                                </h3>
                                            </div>
                                        </div>
                                        <Row className="mt-4">
                                            <Form.Group   controlId="formGridReceivingAddress">
                                                <Form.Label>Receiving Address</Form.Label>
                                            </Form.Group>
                                            <Form.Group  >
                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        onChange={handleTransactionId}
                                                        value={transactionDetailId.txId}
                                                        name="txId"
                                                        placeholder="Ex: 0x1234567890"
                                                    />
                                                    <InputGroup.Text>
                                                        <i className="fas fa-wallet"></i>
                                                    </InputGroup.Text>
                                                </InputGroup>
                                            </Form.Group>
                                        </Row>
                                    </>
                                )}
                                <Row className="mt-4">
                                    <Col
                                    >
                                        <h5 className="text-muted-400 font-heading text-base font-medium">
                                            Total Amount
                                        </h5>
                                    </Col>
                                    <Col>
                                        <p className="mb-0 nui-label text-sm lks">
                                            {depositName === "bitcoin" ? (
                                                <span>
                                                    BTC {transactionDetail.amountMinus} ($
                                                    {`${(transactionDetail.amountMinus * liveBtc).toFixed(2)}`})
                                                </span>
                                            ) : depositName === "ethereum" ? (
                                                <span>
                                                    ETH {transactionDetail.amountMinus} ($
                                                    {`${(transactionDetail.amountMinus * 2241.86).toFixed(2)}`})
                                                </span>
                                            ) : depositName === "tether" ? (
                                                <span>
                                                    USDT {transactionDetail.amountMinus} ($
                                                    {`${(transactionDetail.amountMinus * 1).toFixed(2)}`})
                                                </span>
                                            ) : (
                                                <span></span>
                                            )}
                                        </p>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
 onClick={closeDeposit}
                            variant="danger light"
                        >
                            Cancel
                        </Button>
                        {activeBank ? (
                       
                            
                        <Button 
                            onClick={() => postUserTransaction("bank")}
                                disabled={isDisable} variant="primary">Create</Button>
                        ) : (
                            
                        <Button 
                                onClick={() => postUserTransaction("crypto")}
                                disabled={isDisable} variant="primary">Create</Button>
                          
                        )}
                    </Modal.Footer>
                </Modal>
            }

        </>

    );
};

export default Orders;
