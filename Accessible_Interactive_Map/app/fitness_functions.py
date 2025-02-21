#Calculate Steps

def calc_steps(distance_miles: float, feet: int, inches: int, gender: str = "average") -> int:
    
    # Convert height to inches
    total_height_inches = (feet * 12) + inches
    
    stride_length = total_height_inches * 0.414  

    # Convert distance to inches (1 mile = 63,360 inches)
    distance_inches = distance_miles * 63360
    
    # Calculate steps
    steps = distance_inches / stride_length
    
    return round(steps)


#Calculate Calores Burned

def calc_calories_burned(steps: int, feet: int, inches: int, weight_lbs: float) -> float:
    #Convert height to inches
    total_height_inches = (feet * 12) + inches

    stride_length_inches = total_height_inches * .414 
    stride_length_miles = stride_length_inches / 63360

    #Calculate distance in miles
    distance_miles = steps * stride_length_miles

    #Estimate calories burned per mile
    calories_per_mile = 0.57 * weight_lbs
    calories_burned = distance_miles * calories_per_mile

    return round(calories_burned, 2)


