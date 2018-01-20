# CFG参数整理





## TARGT


```go
class = cTargt;

   cTargt = targt;

       flt_err_lim     = 2,                    ! [kN] flatness errorlimits

                          -250.,                !    minimum

                           250.;                !    maximum
	// 平直度自学习当中的平直度偏差极限范围

       flt_vrn_bled    = 0.9;                  ! [-] target flatness vernierbleed-off
	// 平直度自学习衰减系数

       flt_vrn_lim     = 2,                    ! [kN] target flatnessvernier limits

                          -800.0,               !    minimum

                           800.0;               !    maximum

	// 平直度自学习极限范围
	  flt_vrn_i_gn    = 0.6;                  ! [-] target flatness controlloop integral gain

       flt_vrn_p_gn    = 0.3;                  ! [-] target flatness controlloop proportional gain
	// 平直度自学习PI控制系数

       prf_dev_lim     = 0.010;                ! [mm] target profile deviationlimit
	// 凸度波动极限

       prf_err_lim     = 2,                    ! [mm] profile error limits

                          -0.100,               !    minimum

                           0.100;               !    maximum
	// 凸度自学习偏差极限

       prf_lim         = 2,                    ! [mm] absolute limits

                          0.000,                !    minimum

                          0.250;                !    maximum
	// 凸度最大范围

       prf_tol         = 2,                    ! [mm] target profiletolerances

                          -0.050,               !    minimum

                           0.050;               !    maximum
	// 凸度精度要求

       prf_vrn_bled    = 0.9;                  ! [-] target profile vernier (re-predicted -setup) bleed-off
	// 凸度自学习衰减系数

       prf_vrn_lim     = 2,                    ! [mm] target profilevernier limits

                          -0.070,               !    minimum

                           0.070;               !   maximum
	// 凸度自学习极限

       prf_vrn_rm_i_gn = 0.4;                 ! [-] target profile vernier (re-predicted - measured) control loop

                                               !    integral gain

       prf_vrn_rm_p_gn = 0.2;                 ! [-] target profile vernier (re-predicted - measured) control loop
	// 凸度自学习rm的PI控制系数
                                               !    proportional gain

       prf_vrn_rs_i_gn = 0.2;                 ! [-] target profile vernier (re-predicted - setup) control loop
	// 凸度自学习rs的PI控制系数
                                               !    integral gain

       flt_err_thrshld  = 100;                 ! [kN] Flatness errorthreshold minimum for flatness feedback
	// 平直度自学习，学习的临界点
       opr_mx_wrng_corr = 100;                ! [kN] Maximum operator correction in WRONG direction and still doflatness feedback
	// 操作工如果调整错误，但仍然进行自学习的弯辊力临界点
       apc_start_std    = 1;                   ! [-] APC Correction startstand
	// APC修正开始的机架
       en_ex_strn_calc = true;                ! [-] Enable exit strain calculation
	// 是否允许计算出口应变差
       ex_strn_thk = 10.00;                    ! [mm] Exit strain match forthinkness less than or equal to.
	// 出口应变差对应的最大厚度
       exclude_stainless = false;             ! [-] Exclude stainless steel
	// 是否排除不锈钢钢种
!@(CC087) start

       prf_vrn_sel_flag  = true;               ! [-] Vernier selection flag(false=samp, true=slfg)
	// 凸度自学习，长短期以哪个为主的标识，默认长期自学习
       flt_vrn_sel_flag  = true;               ! [-] Vernier selection flag(false=samp, true=slfg)
	// 平直度自学习，长短期以哪个为主的标识，默认长期自学习
!@(CC087) end        

!@2ND(LC060) start

       wr_crn_off_sel_flag = true;           ! [-] Work roll offset selection flat (false= slfg, true = slfg+sprp)
	// 工作辊凸度补偿，标识是否使用sprp数据，默认使用长期自学习和sprp
!@2ND(LC061) end

   end;

end;
```