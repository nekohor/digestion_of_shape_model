# CFG模型参数整理

C++代码相关的cfg参数整理。

板形的cfg参数可以分为两大类，一类是SSU模块的本身的配置参数，一类的是与FSU共享的配置参数。

与板形计算相关的SSU核心配置参数文件如下。

```c
include = SSU$CONFIG:cfg_alc.txt;          ! create and configure static ALC object
include = MDS$CONFIG:cfg_fcrlc.txt;        ! create and configure CRLC object
include = MDS$CONFIG:cfg_flpce.txt;        ! create and configure LPCE object
include = MDS$CONFIG:cfg_flrg.txt;         ! create and configure LRG object
include = SSU$CONFIG:cfg_fspass.txt;       ! create and configure FSPass objects
include = SSU$CONFIG:cfg_fsstd.txt;        ! create and configure static FSSTD object
include = MDS$CONFIG:cfg_fufd.txt;         ! create and configure UFD object
include = SSU$CONFIG:cfg_penv.txt;         ! create and configure static PENV object
include = SSU$CONFIG:cfg_shapesetup.txt;   ! create and configure static SHAPESETUP object
include = SSU$CONFIG:cfg_shapefeedback.txt; ! create and configure static SHAPEFEEDBACK object
include = SSU$CONFIG:cfg_targt.txt;        ! create and configure static TARGT object
include = SSU$CONFIG:cfg_sfbobs.txt;       ! create and configure static Obs  object
```

FSU相关的配置参数如下。

```c
include = MDS$CONFIG:cfg_fmill.txt;        !create the remainder of static mill object for FM
include = MDS$CONFIG:cfg_ftmpgrad.txt;     !create and configure a tmpgradcfg object
include = FSHARED$CONFIG:cfg_std.txt;      !create the static stand objects
include = MDS$CONFIG:cfg_fmtr.txt;         !create the static motor objects
include = MDS$CONFIG:cfg_frollbite.txt;    !create the static roll bite objects
include = GSM$CONFIG:cfg_sensor.txt;       !create the static sensor objects
include = GSM$CONFIG:cfg_fzone.txt;        !create and configure the zone objects
include = FSHARED$CONFIG:cfg_map.txt;      !create the static map objects
```

## SSU/cfg_alc

```c
class = cAlc;
    cAlc = alc;

    //单位轧制力调节系数
        frcw_adj_mod     = 0.9;                 ! [-] rolling force adjustment modifier
        
    //分配计算过程中迭代的最大次数
        loop_count_lim   = 10;                  ! [-] maximum number of iterations
        
    //单位轧制力最小值
        force_pu_wid_mn  =  2.0;                ! [kN/mm] minimum rolling force per unit piece width
        
    //目标UFD均载辊缝单位凸度和实际UFD均载辊缝单位凸度的偏差容许范围
        ufd_pu_prf_tol   = 0.0001;              ! [mm/mm] UFD roll gap per unit profile tolerance
        
    //是否合理的指示器
        vld              = true;                ! [-] validity indicator
        
    //计算窜弯辊过程中，窜辊万滚的计算顺序，一般先计算窜辊，再计算弯辊
        actr_prior       = 3,                   ! [-] mechanical actuator priority
                           actrtyp_shift,       !    roll CVC shifting system  (SMS)
                           actrtyp_bend,        !    roll bending system
                           actrtyp_none;        !    force fall through
    end;
end;
```



## SSU/cfg_fcrlc

```c
class = cCRLC;
    cCRLC = crlc;

    //窜辊计算迭代的次数
        ! [-] Newton-Raphson maximum number of iterations on roll shift position
        iter_mx = 15;

    //CVC插值CVC等效凸度的向量，从cvc1标签到cvc4标签
        ! [mm] CVC work roll ground crown vector as a f(CVC profile type, CVC roll shift position)
        cvc_cr_mat = 44,
                     -0.860,  -0.634,  -0.522,   -0.409,  -0.296,   -0.183, -0.070,   0.043,   0.156,   0.268,   0.494,
                     -0.700,  -0.608,  -0.494,   -0.379,  -0.265,   -0.150, -0.035,   0.079,   0.194,   0.308,   0.400,
                     -0.700,  -0.608,  -0.494,   -0.379,  -0.265,   -0.150, -0.035,   0.079,   0.194,   0.308,   0.400,
                     -0.700,  -0.608,  -0.494,   -0.379,  -0.265,   -0.150, -0.035,   0.079,   0.194,   0.308,   0.400;

    //CVC插值的位置向量
        ! [mm] CVC roll shift position vector
        cvc_shft_vec = 11,
                    -150.00, -100.00,  -75.00,	 -50.00,  -25.00,    0.00,   25.00,   50.00,   75.00,  100.00,  150.00;

    //带钢-工作辊辊系凸度的最大最小偏差
        ! [mm] minimum / maximum piece to work roll stack crown error
        pce_wr_cr_er = 2,
                       -1.1999,
                        1.1999;

    //窜辊迭代计算的带钢-工作辊凸度偏差最大值或容许范围
        ! [mm] Newton-Raphson piece to work roll stack crown tolerance
        pce_wr_cr_tol = 0.01;

    //每次窜辊迭代计算的窜辊位置变化
        ! [mm] Newton-Raphson delta roll shift position
        pos_shft_dlt = 2.00;

    //最小和最大辊系凸度补偿
        ! [mm] minimum / maximum work roll stack crown offset
        wr_cr_of = 2,
                   -1.20,
                    1.20;

    //最小和最大辊系凸度自学习量
        ! [mm] minimum / maximum work roll stack crown vernier
        wr_cr_vr = 2,
                   -1.20,
                    1.20;

    //CVC辊缝系数
        cvc_gap_coef = 4, 0.000, 0.0000, 0.0000, 0.0000;

!!@2ND-2(MAC005) begin
    //轧辊热胀和磨损的系数
        pce_wr_wear_mult = 1.00;
        wr_br_wear_mult  = 1.00;
        pce_wr_thrm_mult = 1.00;
        wr_br_thrm_mult  = 1.00;

    //初始cvc宽度
        cvc_width_nominal= 1275.0; !! Nominal cvc width for a1 calculation[mm]
    //窜辊最大极限
        cvc_Sm           = 150.0;  !! Shift position limitaion
    //支承辊是否是cvc的指示器
        br_roll_cvc      = true;
!!@2ND-2(MAC005) end        
    end;
end;
```



## SSU/cfg_targt


```c
class = cTargt;
    cTargt = targt;
    // 平直度自学习当中的平直度偏差极限范围
       flt_err_lim     = 2,                    ! [kN] flatness errorlimits
                          -250.,                !    minimum
                           250.;                !    maximum
	
    // 平直度自学习衰减系数
       flt_vrn_bled    = 0.9;                  ! [-] target flatness vernierbleed-off

	// 平直度自学习极限范围
       flt_vrn_lim     = 2,                    ! [kN] target flatnessvernier limits
                          -800.0,               !    minimum
                           800.0;               !    maximum
                     
	// 平直度自学习PI控制系数
	  flt_vrn_i_gn    = 0.6;                  ! [-] target flatness controlloop integral gain
       flt_vrn_p_gn    = 0.3;                  ! [-] target flatness controlloop proportional gain
       
	// 凸度波动极限
       prf_dev_lim     = 0.010;                ! [mm] target profile deviationlimit

	// 凸度自学习偏差极限
       prf_err_lim     = 2,                    ! [mm] profile error limits
                          -0.100,               !    minimum
                           0.100;               !    maximum

	// 凸度最大范围
       prf_lim         = 2,                    ! [mm] absolute limits
                          0.000,                !    minimum
                          0.250;                !    maximum

	// 凸度精度要求
       prf_tol         = 2,                    ! [mm] target profiletolerances
                          -0.050,               !    minimum
                           0.050;               !    maximum

	// 凸度自学习衰减系数
       prf_vrn_bled    = 0.9;                  ! [-] target profile vernier (re-predicted -setup) bleed-off

	// 凸度自学习极限
       prf_vrn_lim     = 2,                    ! [mm] target profilevernier limits
                          -0.070,               !    minimum
                           0.070;               !   maximum

	// 凸度自学习rm的PI控制系数
       prf_vrn_rm_i_gn = 0.4;                 
       ! [-] target profile vernier (re-predicted - measured) control loop integral gain
       prf_vrn_rm_p_gn = 0.2;                 
       ! [-] target profile vernier (re-predicted - measured) control loop proportional gain

	// 凸度自学习rs的PI控制系数
       prf_vrn_rs_i_gn = 0.2;                 
       ! [-] target profile vernier (re-predicted - setup) control loop integral gain

	// 平直度自学习，学习的临界点
       flt_err_thrshld  = 100;                 
       ! [kN] Flatness errorthreshold minimum for flatness feedback

	// 操作工如果调整错误，但仍然进行自学习的弯辊力临界点
       opr_mx_wrng_corr = 100;                
       ! [kN] Maximum operator correction in WRONG direction and still doflatness feedback

	// APC修正开始的机架
       apc_start_std    = 1;                   
       ! [-] APC Correction startstand

	// 是否允许计算出口应变差
       en_ex_strn_calc = true;                
       ! [-] Enable exit strain calculation

	// 出口应变差对应的最大厚度
       ex_strn_thk = 10.00;                    ! [mm] Exit strain match forthinkness less than or equal to.

	// 是否排除不锈钢钢种
       exclude_stainless = false;             ! [-] Exclude stainless steel

!@(CC087) start
	// 凸度自学习，长短期以哪个为主的标识，默认长期自学习
       prf_vrn_sel_flag  = true;               ! [-] Vernier selection flag(false=samp, true=slfg)

	// 平直度自学习，长短期以哪个为主的标识，默认长期自学习
       flt_vrn_sel_flag  = true;               ! [-] Vernier selection flag(false=samp, true=slfg)
!@(CC087) end

!@2ND(LC060) start
	// 工作辊凸度补偿，标识是否使用sprp数据，默认使用长期自学习和sprp
       wr_crn_off_sel_flag = true;           ! [-] Work roll offset selection flat (false= slfg, true = slfg+sprp)
!@2ND(LC061) end
   end;
end;
```



